-- Migration : durcissement sécurité (audit du 2026-07-23)
--
-- Corrige les failles identifiées lors de la revue de sécurité :
--   #1 CRITIQUE  auto-passage en `premium` (contournement du paiement)
--   #2 CRITIQUE  auto-attribution du rôle ADMIN à l'inscription
--   #3 HIGH      clé de correction des quiz (`answers.is_correct`) lisible par tout client
--   #4 HIGH      contenu premium (leçons / lesson_chunks) lisible sans abonnement
--   #5 MEDIUM    `is_admin()` SECURITY DEFINER sans `search_path` fixe
--   #8 LOW       incohérence CHECK `role` vs `is_admin()` (SUPER_ADMIN)
--
-- Idempotente : peut être ré-exécutée sans casse. Elle converge vers l'état
-- sécurisé quelles que soient les policies déjà en place (les noms de policies
-- diffèrent entre l'historique des migrations et le dump de production, d'où
-- les multiples DROP ... IF EXISTS).

-- ============================================================================
-- #5 — is_admin() : figer le search_path (anti-injection sur SECURITY DEFINER)
-- ============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid()
      AND role IN ('ADMIN', 'SUPER_ADMIN')
  );
$$;

-- ============================================================================
-- #8 — réconcilier la contrainte CHECK sur role avec is_admin() (SUPER_ADMIN)
-- ============================================================================
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('LEARNER', 'ADMIN', 'SUPER_ADMIN'));

-- ============================================================================
-- #2 — inscription : ne JAMAIS faire confiance au rôle fourni côté client
--      (raw_user_meta_data est contrôlé par l'appelant du endpoint signUp).
--      Le rôle est forcé à 'LEARNER' ; la promotion se fait uniquement par un
--      admin (policy "Admins can manage profiles" / service role).
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    'LEARNER'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- ============================================================================
-- #1 — empêcher un utilisateur de se rendre premium lui-même.
--      La policy RLS "modifier son profil" autorise l'UPDATE de sa propre
--      ligne sans restreindre les colonnes : sans ce garde, n'importe qui
--      pouvait faire UPDATE profiles SET plan='premium'. Le changement de
--      `plan` (et des champs de paiement) est désormais réservé au service
--      role (Edge Function stripe-webhook) et aux admins.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.prevent_plan_self_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (
        NEW.plan              IS DISTINCT FROM OLD.plan
     OR NEW.stripe_session_id IS DISTINCT FROM OLD.stripe_session_id
     OR NEW.upgraded_at       IS DISTINCT FROM OLD.upgraded_at
     )
     AND auth.role() <> 'service_role'
     AND NOT public.is_admin()
  THEN
    RAISE EXCEPTION 'Modification du plan/paiement interdite : réservée au paiement Stripe';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_plan_self_change ON public.profiles;
CREATE TRIGGER trg_prevent_plan_self_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_plan_self_change();

-- ============================================================================
-- #3 — ne plus exposer la clé de correction des quiz aux clients.
--      Le calcul du score se fait déjà côté serveur (submit_quiz_attempt,
--      SECURITY DEFINER, non affecté par ce REVOKE). Les clients n'ont besoin
--      que de (id, answer_text) pour afficher les options. La colonne
--      is_correct devient invisible via PostgREST pour anon/authenticated.
--      Les admins la lisent via la fonction admin_get_quiz_questions ci-dessous.
--
--      NB PostgreSQL : un REVOKE au niveau colonne est sans effet tant que le
--      rôle possède un SELECT au niveau table (le SELECT table couvre toutes
--      les colonnes). On retire donc le SELECT table, puis on ré-accorde le
--      SELECT sur les seules colonnes non sensibles. Les droits
--      INSERT/UPDATE/DELETE (écriture admin) ne sont pas touchés.
-- ============================================================================
REVOKE SELECT ON public.answers FROM anon, authenticated;
GRANT SELECT (id, question_id, answer_text) ON public.answers TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_get_quiz_questions(p_quiz_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Permissions insuffisantes';
  END IF;

  SELECT COALESCE(jsonb_agg(to_jsonb(t) ORDER BY t.order_index), '[]'::jsonb)
  INTO v_result
  FROM (
    SELECT
      ques.id,
      ques.quiz_id,
      ques.question_text,
      ques.order_index,
      (
        SELECT COALESCE(
          jsonb_agg(jsonb_build_object(
            'id',          a.id,
            'question_id', a.question_id,
            'answer_text', a.answer_text,
            'is_correct',  a.is_correct
          )),
          '[]'::jsonb
        )
        FROM public.answers a
        WHERE a.question_id = ques.id
      ) AS answers
    FROM public.questions ques
    WHERE ques.quiz_id = p_quiz_id
  ) t;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_get_quiz_questions(uuid) TO authenticated;

-- ============================================================================
-- #4a — leçons : rétablir/garantir le gating premium par `is_free`.
--       (Une migration antérieure avait ramené la policy à `is_published`
--       seul, ce qui exposait le contenu des modules 2 à 8 à tout le monde.)
--       Lecture : leçon gratuite -> tous ; leçon premium -> abonnés premium
--       ou admin. Écriture : admin / service role uniquement.
-- ============================================================================
DROP POLICY IF EXISTS "Public can view published lessons" ON public.lessons;
DROP POLICY IF EXISTS "Admins can manage lessons"         ON public.lessons;
DROP POLICY IF EXISTS "lessons: gratuites pour tous"      ON public.lessons;
DROP POLICY IF EXISTS "lessons: premium pour abonnés"     ON public.lessons;
DROP POLICY IF EXISTS "lessons: écriture admin"           ON public.lessons;
DROP POLICY IF EXISTS "lessons_free_readable"             ON public.lessons;
DROP POLICY IF EXISTS "lessons_premium_readable"          ON public.lessons;
DROP POLICY IF EXISTS "lessons_admin_all"                 ON public.lessons;

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lessons_free_readable"
  ON public.lessons FOR SELECT
  USING (COALESCE(is_published, true) = true AND is_free = true);

CREATE POLICY "lessons_premium_readable"
  ON public.lessons FOR SELECT
  USING (
    COALESCE(is_published, true) = true
    AND is_free = false
    AND (
      public.is_admin()
      OR EXISTS (
        SELECT 1 FROM public.profiles p
        WHERE p.id = auth.uid() AND p.plan = 'premium'
      )
    )
  );

CREATE POLICY "lessons_admin_all"
  ON public.lessons FOR ALL
  USING (auth.role() = 'service_role' OR public.is_admin())
  WITH CHECK (auth.role() = 'service_role' OR public.is_admin());

-- ============================================================================
-- #4b — lesson_chunks (contenu RAG) : lecture réservée aux admins.
--       Les clients n'interrogent jamais cette table directement ; l'Edge
--       Function ARIA l'utilise via le service role (qui contourne la RLS).
--       Cela ferme aussi l'accès direct à similarity_search() : cette fonction
--       n'est PAS SECURITY DEFINER, donc la RLS de l'appelant s'applique — un
--       utilisateur non-admin n'en tirera plus aucune ligne.
-- ============================================================================
DROP POLICY IF EXISTS "lesson_chunks: lecture authentifiée" ON public.lesson_chunks;
DROP POLICY IF EXISTS "lesson_chunks: écriture admin"       ON public.lesson_chunks;
DROP POLICY IF EXISTS "lesson_chunks_admin_all"             ON public.lesson_chunks;

ALTER TABLE public.lesson_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "lesson_chunks_admin_all"
  ON public.lesson_chunks FOR ALL
  USING (auth.role() = 'service_role' OR public.is_admin())
  WITH CHECK (auth.role() = 'service_role' OR public.is_admin());

-- Défense en profondeur : anon n'a aucune raison d'appeler la recherche
-- vectorielle (la RLS le bloque déjà, mais on retire aussi le droit d'exécuter).
REVOKE EXECUTE ON FUNCTION public.similarity_search(
  public.vector, double precision, integer, uuid, uuid
) FROM anon;
