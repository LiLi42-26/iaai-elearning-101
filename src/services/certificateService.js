// src/services/certificateService.js
import { supabase } from './supabaseClient'

// ─── Vérifier si l'utilisateur mérite un certificat ─────────────────────────

export async function checkCertificateEligibility(userId, moduleId) {
  // 1. Toutes les leçons du module sont complétées ?
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

  const allLessonsComplete = totalLessons > 0 && completedLessons === totalLessons

  // 2. Quiz réussi avec score >= 80 ?
  const { data: attempt } = await supabase
    .from('quiz_attempts')
    .select('score, passed')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .eq('passed', true)
    .order('score', { ascending: false })
    .limit(1)
    .single()

  return {
    eligible: allLessonsComplete && !!attempt,
    allLessonsComplete,
    quizPassed: !!attempt,
    bestScore: attempt?.score || 0,
  }
}

// ─── Générer un certificat ───────────────────────────────────────────────────

export async function generateCertificate(userId, moduleId) {
  // Vérifier l'éligibilité
  const eligibility = await checkCertificateEligibility(userId, moduleId)
  if (!eligibility.eligible) {
    throw new Error('Conditions non remplies pour obtenir le certificat')
  }

  // Vérifier si déjà généré
  const existing = await getCertificate(userId, moduleId)
  if (existing) return existing

  // Générer un numéro unique
  const certificateNumber = `IAAI-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

  const { data, error } = await supabase
    .from('certificates')
    .insert({
      user_id: userId,
      module_id: moduleId,
      certificate_number: certificateNumber,
      issued_at: new Date().toISOString(),
      score: eligibility.bestScore,
    })
    .select('*, modules(title)')
    .single()

  if (error) throw error
  return data
}

// ─── Récupérer un certificat ─────────────────────────────────────────────────

export async function getCertificate(userId, moduleId) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, modules(title)')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .single()

  if (error) return null
  return data
}

// ─── Tous les certificats d'un utilisateur ───────────────────────────────────

export async function getUserCertificates(userId) {
  const { data, error } = await supabase
    .from('certificates')
    .select('*, modules(title, order_index)')
    .eq('user_id', userId)
    .order('issued_at', { ascending: false })

  if (error) throw error
  return data || []
}
