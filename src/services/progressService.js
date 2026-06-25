// src/services/progressService.js
import { supabase } from './supabaseClient'

// ─── Marquer une leçon comme complétée ───────────────────────────────────────

export async function markLessonComplete(userId, lessonId, moduleId) {
  const { data, error } = await supabase
    .from('user_progress')
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        module_id: moduleId,
        completed: true,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lesson_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data
}

// ─── Récupérer la progression d'un utilisateur ────────────────────────────────

export async function getUserProgress(userId) {
  const { data, error } = await supabase
    .from('user_progress')
    .select('*, lessons(title, module_id), modules(title)')
    .eq('user_id', userId)
    .eq('completed', true)

  if (error) throw error
  return data
}

// ─── Progression globale (pourcentage total) ─────────────────────────────────

export async function getOverallProgress(userId) {
  // Les deux requêtes en parallèle pour minimiser la latence
  const [totalRes, completedRes] = await Promise.all([
    supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true),
  ])

  const totalLessons     = totalRes.count     || 0
  const completedLessons = completedRes.count || 0

  return {
    totalLessons,
    completedLessons,
    percent: totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0,
  }
}

// ─── Progression par module ───────────────────────────────────────────────────

export async function getProgressByModule(userId, moduleId) {
  // Les deux requêtes en parallèle
  const [totalRes, completedRes] = await Promise.all([
    supabase
      .from('lessons')
      .select('*', { count: 'exact', head: true })
      .eq('module_id', moduleId),
    supabase
      .from('user_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('module_id', moduleId)
      .eq('completed', true),
  ])

  const totalLessons     = totalRes.count     || 0
  const completedLessons = completedRes.count || 0

  return {
    totalLessons,
    completedLessons,
    percent: totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0,
  }
}

// ─── Enregistrer l'activité utilisateur ──────────────────────────────────────
//
// CORRECTION : ancienne signature → logUserActivity(userId, action, metadata)
//              les champs 'action' et 'metadata' n'étaient pas lus par
//              dashboardService ni ProfilePage (qui sélectionnent type/title/detail).
//
// Nouvelle signature → logUserActivity(userId, type, title, detail)
//   - type   : 'lesson' | 'quiz' | 'module' | 'certificate'  (CHECK constraint en base)
//   - title  : libellé affiché dans le dashboard / profil
//   - detail : info complémentaire optionnelle (ex: score, nom du module)
//
// Les champs 'action' et 'metadata' restent en base pour compatibilité,
// ils ne sont juste plus utilisés comme source principale d'affichage.

export async function logUserActivity(userId, type, title, detail = '') {
  // Validation du type côté client pour éviter une violation de CHECK en base
  const VALID_TYPES = ['lesson', 'quiz', 'module', 'certificate']
  if (!VALID_TYPES.includes(type)) {
    console.warn(`[logUserActivity] type invalide : "${type}". Attendu : ${VALID_TYPES.join(' | ')}`)
    return
  }

  const { error } = await supabase
    .from('user_activity')
    .insert({
      user_id: userId,
      type,
      title,
      detail: detail || null,
      // 'action' et 'metadata' ont des valeurs DEFAULT en base (TEXT nullable / JSONB '{}')
      // → pas besoin de les envoyer explicitement
    })

  if (error) console.warn('[logUserActivity] Erreur:', error.message)
}