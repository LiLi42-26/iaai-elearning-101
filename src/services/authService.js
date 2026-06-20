// src/services/authService.js
import { supabase } from '@/services/supabaseClient'

// ─── Inscription ─────────────────────────────────────────────────────────────
export async function register({ fullName, email, password }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: 'LEARNER',
      },
    },
  })

  if (error) throw error
  return data
}

// ─── Connexion ────────────────────────────────────────────────────────────────
export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// ─── Déconnexion ─────────────────────────────────────────────────────────────
export async function logout() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// ─── Session actuelle ─────────────────────────────────────────────────────────
export async function getSession() {
  const { data, error } = await supabase.auth.getSession()
  if (error) throw error
  return data.session
}

// ─── Mot de passe oublié ──────────────────────────────────────────────────────
export async function forgotPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw error
}