// src/services/ariaService.js
// Service React — appel à l'Edge Function ARIA (Gemini + pgvector)

import { supabase } from './supabaseClient'

// CORRECTION : l'URL ne doit pas contenir le project-ref en dur.
// On reconstruit l'URL depuis VITE_SUPABASE_URL déjà disponible dans l'env.
const ARIA_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/aria`

// ─── Appeler ARIA avec une question ──────────────────────────────────────────
export async function askARIA({ question, lessonId = null, moduleId = null, history = [] }) {
  // Récupérer le token JWT de l'utilisateur connecté
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) {
    return { error: 'Vous devez être connecté pour utiliser ARIA.' }
  }

  try {
    const response = await fetch(ARIA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ question, lessonId, moduleId, history }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { error: data.error || 'Erreur serveur ARIA' }
    }

    return {
      reponse:     data.reponse,
      sources:     data.sources     ?? [],
      chunksFound: data.chunksFound ?? 0,
    }

  } catch (err) {
    console.error('[ariaService]', err)
    return { error: 'Impossible de contacter ARIA. Vérifiez votre connexion.' }
  }
}