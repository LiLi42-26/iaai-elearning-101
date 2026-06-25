// src/services/courseService.js
import { supabase } from './supabaseClient'

// ─── Modules ──────────────────────────────────────────────────────────────────

export async function getAllModules() {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export async function getModuleById(moduleId) {
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('id', moduleId)
    .single()

  if (error) throw error
  return data
}

// ─── Leçons ───────────────────────────────────────────────────────────────────

export async function getLessonsByModule(moduleId) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true })

  if (error) throw error
  return data
}

export async function getLessonById(lessonId) {
  const { data, error } = await supabase
    .from('lessons')
    .select('*, modules(title)')
    .eq('id', lessonId)
    .single()

  if (error) throw error
  return data
}

// ─── SUPPRIMÉ : getCurriculumWithProgress ─────────────────────────────────────
// Cette fonction faisait un LEFT JOIN sur user_progress sans filtre user_id
// côté Supabase, exposant les progressions de tous les utilisateurs dans la
// réponse JSON (le filtre JS côté client arrivait trop tard).
//
// Remplacée par 3 requêtes séparées directement dans CurriculumPage.jsx :
//   1. supabase.from('modules').select('*')
//   2. supabase.from('lessons').select('*')
//   3. supabase.from('user_progress').select(...).eq('user_id', userId)
//
// Cette approche est plus sûre (RLS s'applique correctement sur chaque requête)
// et plus lisible.