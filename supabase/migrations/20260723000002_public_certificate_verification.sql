-- Migration : vérification publique des certificats.
--
-- La page /verify/:number (accessible sans connexion) et le lien « Copier le
-- lien public » / LinkedIn pointaient vers une page qui n'existait pas, et la
-- RLS de `certificates` n'autorise la lecture qu'aux utilisateurs authentifiés.
--
-- On expose une RPC SECURITY DEFINER qui, à partir d'un numéro de certificat,
-- renvoie UNIQUEMENT des champs non sensibles (nom du titulaire, numéro, score,
-- date). Elle n'expose jamais l'user_id ni l'email. Accessible à anon.

CREATE OR REPLACE FUNCTION public.verify_certificate(p_cert_number text)
RETURNS jsonb
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT jsonb_build_object(
    'valid',              true,
    'holder_name',        p.full_name,
    'certificate_number', c.certificate_number,
    'score',              c.score,
    'issued_at',          c.issued_at
  )
  FROM public.certificates c
  JOIN public.profiles p ON p.id = c.user_id
  WHERE c.certificate_number = p_cert_number
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.verify_certificate(text) TO anon, authenticated;
