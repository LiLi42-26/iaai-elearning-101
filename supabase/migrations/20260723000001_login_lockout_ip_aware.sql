-- Migration : verrouillage de connexion « conscient de l'IP » (corrige le
-- déni de service ciblé — finding #7 de la revue de sécurité).
--
-- Problème corrigé :
--   record_login_attempt(email, false) est exécutable par `anon` (nécessaire
--   AVANT authentification). Avec un verrou purement par email, un attaquant
--   pouvait appeler cette fonction en boucle avec l'email d'une victime et la
--   verrouiller à distance — un DoS ciblé sur n'importe quel compte.
--
-- Choix de conception :
--   - Le verrou est désormais calculé par (email + IP de l'appelant). Un
--     attaquant depuis une IP ne peut donc plus empêcher la victime de se
--     connecter depuis SA propre IP : chaque IP a son propre compteur d'échecs.
--     La protection anti-bruteforce reste intacte pour l'attaquant lui-même
--     (il se verrouille sur sa propre IP).
--   - L'IP est lue depuis les en-têtes de requête PostgREST
--     (cf-connecting-ip / x-real-ip / x-forwarded-for). Si aucune IP n'est
--     disponible (appel direct hors PostgREST), on retombe sur l'ancien
--     comportement par email seul afin de ne pas perdre la protection.

-- ── Colonne IP ──────────────────────────────────────────────────────────────
ALTER TABLE public.login_attempts
  ADD COLUMN IF NOT EXISTS ip TEXT;

CREATE INDEX IF NOT EXISTS idx_login_attempts_email_ip_time
  ON public.login_attempts (email, ip, attempted_at DESC);

-- ── Helper : extraire l'IP cliente des en-têtes de la requête courante ───────
CREATE OR REPLACE FUNCTION public.current_request_ip()
RETURNS TEXT
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_headers JSONB;
  v_xff     TEXT;
BEGIN
  -- `request.headers` n'existe que dans le contexte d'une requête PostgREST.
  BEGIN
    v_headers := current_setting('request.headers', true)::jsonb;
  EXCEPTION WHEN OTHERS THEN
    RETURN NULL;
  END;

  IF v_headers IS NULL THEN
    RETURN NULL;
  END IF;

  -- Ordre de préférence : Cloudflare, puis x-real-ip, puis x-forwarded-for.
  IF COALESCE(v_headers->>'cf-connecting-ip', '') <> '' THEN
    RETURN v_headers->>'cf-connecting-ip';
  END IF;
  IF COALESCE(v_headers->>'x-real-ip', '') <> '' THEN
    RETURN v_headers->>'x-real-ip';
  END IF;

  v_xff := v_headers->>'x-forwarded-for';
  IF COALESCE(v_xff, '') <> '' THEN
    -- x-forwarded-for = "client, proxy1, proxy2" -> on garde le premier.
    RETURN trim(split_part(v_xff, ',', 1));
  END IF;

  RETURN NULL;
END;
$$;

-- ── Enregistrer une tentative (avec IP) ─────────────────────────────────────
CREATE OR REPLACE FUNCTION public.record_login_attempt(p_email TEXT, p_success BOOLEAN)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.login_attempts (email, success, ip)
  VALUES (lower(trim(p_email)), p_success, public.current_request_ip());

  DELETE FROM public.login_attempts
  WHERE attempted_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- ── Vérifier le verrou pour (email + IP de l'appelant) ──────────────────────
CREATE OR REPLACE FUNCTION public.is_login_locked(p_email TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_max_attempts    INT;
  v_lockout_minutes INT;
  v_fail_count      INT;
  v_oldest_fail     TIMESTAMPTZ;
  v_locked_until    TIMESTAMPTZ;
  v_ip              TEXT;
  v_email           TEXT := lower(trim(p_email));
  v_last_success    TIMESTAMPTZ;
BEGIN
  SELECT
    COALESCE((data->>'maxLoginAttempts')::INT, 5),
    COALESCE((data->>'lockoutDuration')::INT, 15)
  INTO v_max_attempts, v_lockout_minutes
  FROM public.settings WHERE id = 1;

  IF v_max_attempts IS NULL THEN v_max_attempts := 5; END IF;
  IF v_lockout_minutes IS NULL THEN v_lockout_minutes := 15; END IF;

  v_ip := public.current_request_ip();

  -- Dernier succès pour cet email (tout IP confondu) : un login réussi
  -- réinitialise le compteur d'échecs.
  SELECT MAX(attempted_at) INTO v_last_success
  FROM public.login_attempts
  WHERE email = v_email AND success = TRUE;

  -- Échecs récents pour (email + IP courante). Si l'IP est indisponible,
  -- repli sur le comportement par email seul.
  SELECT COUNT(*), MIN(attempted_at) INTO v_fail_count, v_oldest_fail
  FROM public.login_attempts
  WHERE email = v_email
    AND success = FALSE
    AND (v_ip IS NULL OR ip IS NOT DISTINCT FROM v_ip)
    AND attempted_at > COALESCE(v_last_success, '1970-01-01'::TIMESTAMPTZ);

  IF v_fail_count >= v_max_attempts THEN
    v_locked_until := v_oldest_fail + (v_lockout_minutes || ' minutes')::INTERVAL;
    IF NOW() < v_locked_until THEN
      RETURN jsonb_build_object(
        'locked', TRUE,
        'attempts_remaining', 0,
        'retry_after_seconds', EXTRACT(EPOCH FROM (v_locked_until - NOW()))::INT
      );
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'locked', FALSE,
    'attempts_remaining', GREATEST(v_max_attempts - v_fail_count, 0),
    'retry_after_seconds', 0
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.current_request_ip() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_login_attempt(TEXT, BOOLEAN) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_login_locked(TEXT) TO anon, authenticated;
