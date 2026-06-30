// src/services/settingsService.js
// Service paramètres — lecture et persistance vers Supabase profiles

import { supabase } from './supabaseClient'

// ─── Préférences par défaut ───────────────────────────────────────────────────
export const DEFAULT_PREFERENCES = {
  notifications: {
    email_cours:     true,
    email_community: false,
    email_badge:     true,
    email_promo:     false,
    push_rappel:     true,
    push_reponse:    true,
  },
  privacy: {
    profil_public:       true,
    progression_visible: false,
    badges_visibles:     true,
  },
  langue: 'fr',
}

// ─── Charger le profil complet (compte + préférences) ────────────────────────
export async function loadUserSettings(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, bio, avatar_url, preferences, plan, role, created_at')
    .eq('id', userId)
    .single()

  if (error) throw error

  // Fusionner avec les valeurs par défaut pour les clés manquantes
  const prefs = {
    notifications: {
      ...DEFAULT_PREFERENCES.notifications,
      ...(data.preferences?.notifications ?? {}),
    },
    privacy: {
      ...DEFAULT_PREFERENCES.privacy,
      ...(data.preferences?.privacy ?? {}),
    },
    langue: data.preferences?.langue ?? DEFAULT_PREFERENCES.langue,
  }

  return { ...data, preferences: prefs }
}

// ─── Sauvegarder les infos du compte (nom, bio) ──────────────────────────────
export async function saveAccountInfo(userId, { fullName, bio }) {
  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName.trim(),
      bio:       bio?.trim() ?? null,
    })
    .eq('id', userId)

  if (error) throw error
}

// ─── Changer le mot de passe ─────────────────────────────────────────────────
export async function changePassword({ currentPassword, newPassword }) {
  // Supabase ne vérifie pas l'ancien mot de passe côté client.
  // On ré-authentifie d'abord pour valider l'ancien mot de passe.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.email) throw new Error('Session expirée. Reconnectez-vous.')

  // Ré-authentification pour valider l'ancien mot de passe
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email:    user.email,
    password: currentPassword,
  })
  if (signInError) throw new Error('Mot de passe actuel incorrect.')

  // Mise à jour du mot de passe
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}

// ─── Sauvegarder les préférences de notifications ────────────────────────────
export async function saveNotificationPrefs(userId, notifPrefs) {
  const { error } = await supabase.rpc('merge_preferences', {
    p_user_id: userId,
    p_key:     'notifications',
    p_value:   notifPrefs,
  })

  // Fallback si la fonction RPC n'existe pas encore
  if (error?.message?.includes('function') || error?.code === 'PGRST202') {
    return savePrefsDirectly(userId, { notifications: notifPrefs })
  }
  if (error) throw error
}

// ─── Sauvegarder les préférences de confidentialité ──────────────────────────
export async function savePrivacyPrefs(userId, privacyPrefs) {
  const { error } = await supabase.rpc('merge_preferences', {
    p_user_id: userId,
    p_key:     'privacy',
    p_value:   privacyPrefs,
  })

  if (error?.message?.includes('function') || error?.code === 'PGRST202') {
    return savePrefsDirectly(userId, { privacy: privacyPrefs })
  }
  if (error) throw error
}

// ─── Sauvegarder la langue ───────────────────────────────────────────────────
export async function saveLanguePref(userId, langue) {
  return savePrefsDirectly(userId, { langue })
}

// ─── Helper : mise à jour directe du JSONB preferences ───────────────────────
async function savePrefsDirectly(userId, partialPrefs) {
  // Charger les préférences actuelles
  const { data, error: fetchError } = await supabase
    .from('profiles')
    .select('preferences')
    .eq('id', userId)
    .single()

  if (fetchError) throw fetchError

  const merged = { ...(data.preferences ?? {}), ...partialPrefs }

  const { error } = await supabase
    .from('profiles')
    .update({ preferences: merged })
    .eq('id', userId)

  if (error) throw error
}

// ─── Upload avatar ────────────────────────────────────────────────────────────
export async function uploadAvatar(userId, file) {
  // Valider le fichier
  const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
  if (file.size > MAX_SIZE) throw new Error('Image trop lourde (max 2 Mo).')
  if (!file.type.startsWith('image/')) throw new Error('Format invalide. Utilisez JPG, PNG ou WebP.')

  const ext  = file.name.split('.').pop().toLowerCase()
  const path = `${userId}/avatar.${ext}`

  // Upload vers Supabase Storage (bucket: avatars)
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) throw uploadError

  // Récupérer l'URL publique
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path)

  // Mettre à jour le profil
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ avatar_url: publicUrl })
    .eq('id', userId)

  if (updateError) throw updateError

  return publicUrl
}