// src/services/quizService.js
import { supabase } from './supabaseClient'

// ─── Récupérer le quiz d'un module ───────────────────────────────────────────

export async function getQuizByModule(moduleId) {
  const { data, error } = await supabase
    .from('quizzes')
    .select(`
      *,
      questions (
        id,
        question_text,
        order_index,
        answers (id, answer_text, is_correct)
      )
    `)
    .eq('module_id', moduleId)
    .single()

  if (error) throw error

  // Trier les questions par order_index
  if (data?.questions) {
    data.questions.sort((a, b) => a.order_index - b.order_index)
  }

  return data
}

// ─── Soumettre une tentative de quiz ─────────────────────────────────────────
//
// CORRECTION : le seuil de réussite était hardcodé à 80.
// La table quizzes a un champ passing_score configurable par quiz.
// → On passe passingScore en paramètre (défaut : 80 pour la rétrocompatibilité).
//
// CORRECTION : filtrer les réponses nulles (question sautée via expiration du timer).
// Avant : une réponse { questionId, answerId: null } pouvait fausser le score.
//
// CORRECTION : vérification défensive si questions.length === 0
// pour éviter une division par zéro.

export async function submitQuizAttempt(userId, quizId, moduleId, answers, passingScore = 80) {
  // answers = [{ questionId, answerId }]

  // Récupérer les bonnes réponses depuis la base
  // (ne pas se fier aux réponses côté client — sécurité)
  const { data: questions, error: qError } = await supabase
    .from('questions')
    .select('id, answers(id, is_correct)')
    .eq('quiz_id', quizId)

  if (qError) throw qError

  if (!questions || questions.length === 0) {
    throw new Error('Aucune question trouvée pour ce quiz.')
  }

  // Filtrer les réponses nulles (questions sautées en cas d'expiration du timer)
  const validAnswers = answers.filter(a => a.answerId !== null && a.answerId !== undefined)

  // Calculer le score
  let correct = 0
  for (const answer of validAnswers) {
    const question = questions.find(q => q.id === answer.questionId)
    if (!question) continue
    const selectedAnswer = question.answers.find(a => a.id === answer.answerId)
    if (selectedAnswer?.is_correct) correct++
  }

  const score  = Math.round((correct / questions.length) * 100)
  const passed = score >= passingScore  // ✅ utilise le seuil du quiz, pas 80 en dur

  // Enregistrer la tentative
  const { data, error } = await supabase
    .from('quiz_attempts')
    .insert({
      user_id:      userId,
      quiz_id:      quizId,
      module_id:    moduleId,
      score,
      passed,
      answers_given: validAnswers,
      attempted_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) throw error

  return { ...data, correct, total: questions.length, score, passed }
}

// ─── Récupérer les tentatives d'un utilisateur ───────────────────────────────

export async function getUserQuizAttempts(userId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*, quizzes(title, module_id), modules(title)')
    .eq('user_id', userId)
    .order('attempted_at', { ascending: false })

  if (error) throw error
  return data
}

// ─── Meilleur score pour un quiz ─────────────────────────────────────────────

export async function getBestScore(userId, quizId) {
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('score, passed')
    .eq('user_id', userId)
    .eq('quiz_id', quizId)
    .order('score', { ascending: false })
    .limit(1)
    .single()

  if (error) return null
  return data
}