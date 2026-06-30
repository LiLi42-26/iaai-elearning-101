// src/services/notificationService.js
// Service notifications — lecture, marquage lu, realtime Supabase

import { supabase } from './supabaseClient'

// ─── Catégories de notifications ─────────────────────────────────────────────
// Mapping type DB → config d'affichage (onglet, icône fallback)
export const NOTIF_TABS = [
  { label: 'Toutes',      filter: null },
  { label: 'Cours',       filter: ['lesson', 'module'] },
  { label: 'Quiz',        filter: ['quiz'] },
  { label: 'Réussites',   filter: ['certificate', 'premium'] },
]

// ─── Récupérer les notifications d'un utilisateur ────────────────────────────
export async function getNotifications(userId, { limit = 30 } = {}) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

// ─── Compter les non lues ─────────────────────────────────────────────────────
export async function getUnreadCount(userId) {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
  return count ?? 0
}

// ─── Marquer une notification comme lue ──────────────────────────────────────
export async function markNotificationRead(notifId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notifId)

  if (error) throw error
}

// ─── Marquer toutes les notifications comme lues ─────────────────────────────
export async function markAllNotificationsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)

  if (error) throw error
}

// ─── S'abonner aux nouvelles notifications en temps réel ─────────────────────
// Retourne la subscription — à unsubscribe() quand le composant se démonte
export function subscribeToNotifications(userId, onNewNotification) {
  const channel = supabase
    .channel(`notifications:${userId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        onNewNotification(payload.new)
      }
    )
    .subscribe()

  return channel
}

// ─── Formater la date relative ────────────────────────────────────────────────
export function formatNotifTime(isoString) {
  if (!isoString) return 'Récemment'
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours   = Math.floor(diff / 3600000)
  const days    = Math.floor(diff / 86400000)

  if (minutes < 1)  return "À l'instant"
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours   < 24) return `Il y a ${hours}h`
  if (days    === 1) return 'Hier'
  if (days    < 7)  return `Il y a ${days} jours`

  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short',
  })
}