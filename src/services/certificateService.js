// src/services/certificateService.js
import { supabase } from './supabaseClient'

// ─── Vérifier si l'utilisateur mérite le certificat (TOUT le parcours) ───────
//
// CORRECTION : cette fonction vérifiait auparavant un seul module (moduleId).
// Il n'y a qu'un seul certificat pour l'ensemble du cursus, donc on vérifie
// désormais que TOUS les modules publiés sont complétés (leçons + quiz).

export async function checkCertificateEligibility(userId) {
  const { data: modules, error: modulesError } = await supabase
    .from('modules')
    .select('id')
    .eq('is_published', true)

  if (modulesError) throw modulesError

  const moduleIds = (modules || []).map((m) => m.id)

  if (moduleIds.length === 0) {
    return { eligible: false, completedModules: 0, totalModules: 0 }
  }

  let completedModules = 0

  for (const moduleId of moduleIds) {
    const { count: totalLessons } = await supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', moduleId)

    const { count: completedLessons } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .eq('completed', true)

    const { data: attempt } = await supabase
      .from('quiz_attempts')
      .select('id')
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .eq('passed', true)
      .limit(1)
      .maybeSingle()

    const moduleComplete =
      totalLessons > 0 && completedLessons === totalLessons && !!attempt

    if (moduleComplete) completedModules += 1
  }

  return {
    eligible: completedModules === moduleIds.length,
    completedModules,
    totalModules: moduleIds.length,
  }
}

// ─── Générer le certificat (une seule fois par utilisateur) ─────────────────
//
// CORRECTION : plus de moduleId — la base vérifie elle-même l'éligibilité
// sur l'ensemble du parcours et crée l'unique certificat de l'utilisateur.

export async function generateCertificate(userId) {
  const { error } = await supabase.rpc('issue_certificate').single()

  if (error) throw error
  return getCertificate(userId)
}

// ─── Récupérer le certificat de l'utilisateur ────────────────────────────────
//
// CORRECTION : un seul certificat par utilisateur désormais, plus besoin de
// moduleId pour le retrouver.

export async function getCertificate(userId) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, modules(title)')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}

// ─── Tous les certificats d'un utilisateur (liste, pour compatibilité UI) ────

export async function getUserCertificates(userId) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, modules(title, order_index)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  if (error) throw error
  return data || []
}

// ─── Vérification publique d'un certificat par son numéro ────────────────────
//
// Utilisée par la page publique /verify/:number (accessible sans connexion).
// Passe par une RPC SECURITY DEFINER qui n'expose que des champs non sensibles
// (nom du titulaire, numéro, score, date) — jamais l'email ni l'user_id.
export async function verifyCertificate(certNumber) {
  const { data, error } = await supabase
    .rpc('verify_certificate', { p_cert_number: certNumber })

  if (error) throw error
  return data || null
}
