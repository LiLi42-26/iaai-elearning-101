// src/pages/Notifications/NotificationsPage.jsx
import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  subscribeToNotifications,
  formatNotifTime,
  NOTIF_TABS,
} from '@/services/notificationService'

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function NotifSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-[#f0f0f5]"
        >
          <div className="w-12 h-12 rounded-xl bg-[#e5eeff] flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[#e5eeff] rounded w-3/4" />
            <div className="h-3 bg-[#e5eeff] rounded w-full" />
            <div className="h-3 bg-[#e5eeff] rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── État vide ────────────────────────────────────────────────────────────────
function EmptyState({ tab }) {
  const messages = {
    'Toutes':    { icon: 'notifications_off', text: 'Aucune notification pour l\'instant' },
    'Cours':     { icon: 'school',            text: 'Aucune notification de cours' },
    'Quiz':      { icon: 'quiz',              text: 'Aucun résultat de quiz' },
    'Réussites': { icon: 'workspace_premium', text: 'Aucune réussite à afficher' },
  }
  const { icon, text } = messages[tab] ?? messages['Toutes']

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <span className="material-symbols-outlined text-[56px] text-[#cfc2d6]">{icon}</span>
      <p className="font-bold text-[#7e7385]">{text}</p>
      <p className="text-sm text-[#7e7385]">
        Complétez une leçon ou un quiz pour voir vos notifications ici.
      </p>
    </div>
  )
}

// ─── Toast "nouvelle notification" ───────────────────────────────────────────
function NewNotifToast({ notif, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000)
    return () => clearTimeout(t)
  }, [onDismiss])

  return (
    <div
      className="fixed top-6 right-6 z-50 flex items-start gap-3 bg-white border
                 border-[#8127cf]/20 rounded-2xl shadow-xl p-4 max-w-sm
                 animate-fade-in"
      style={{ boxShadow: '0 8px 32px rgba(129,39,207,.12)' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                   text-white text-xs font-bold"
        style={{ background: 'linear-gradient(135deg, #ec4899, #8127cf)' }}
      >
        <span className="material-symbols-outlined text-[18px]">notifications</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#8127cf] mb-0.5">Nouvelle notification</p>
        <p className="text-sm text-[#0b1c30] leading-snug">{notif.title}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-[#7e7385] hover:text-[#0b1c30] transition-colors flex-shrink-0"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  )
}

// ─── Carte notification ───────────────────────────────────────────────────────
function NotifCard({ notif, onRead }) {
  const handleClick = () => {
    if (!notif.read) onRead(notif.id)
  }

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start gap-4 p-5 rounded-2xl cursor-pointer
                  transition-all hover:translate-x-1
                  ${!notif.read
                    ? 'bg-[#8127cf]/5 border-l-4 border-l-[#8127cf] border border-[#8127cf]/10 shadow-sm hover:shadow-md'
                    : 'bg-white border border-[#f0f0f5] hover:shadow-md'
                  }`}
    >
      {/* Icône */}
      <div
        className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center
                    ${notif.icon_bg} ${notif.icon_text}`}
      >
        <span
          className="material-symbols-outlined text-[26px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {notif.icon}
        </span>
      </div>

      {/* Contenu */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="text-sm font-bold text-[#0b1c30] leading-snug">
            {notif.title}
          </h4>
          {!notif.read && (
            <span
              className="text-xs font-bold text-[#8127cf] bg-[#f0dbff]
                         px-2 py-0.5 rounded-full flex-shrink-0"
            >
              Nouveau
            </span>
          )}
        </div>

        <p className="text-sm text-[#7e7385] leading-relaxed">{notif.body}</p>

        {/* Bouton d'action si présent */}
        {notif.action_url && notif.action_label && (
          <div className="flex gap-2 mt-3">
            <Link
              to={notif.action_url}
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-1.5 bg-[#8127cf] text-white text-xs font-bold
                         rounded-lg hover:bg-[#6900b3] transition-colors"
            >
              {notif.action_label}
            </Link>
          </div>
        )}

        <p className="text-xs text-[#7e7385] mt-3 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          {formatNotifTime(notif.created_at)}
        </p>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const { user } = useAuthStore()

  const [notifications, setNotifications] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [activeTab, setActiveTab]         = useState('Toutes')
  const [toastNotif, setToastNotif]       = useState(null)
  const [markingAll, setMarkingAll]       = useState(false)

  // ── Charger les notifications depuis Supabase ─────────────────────────────
  const loadNotifications = useCallback(async () => {
    if (!user?.id) return
    try {
      setError(null)
      const data = await getNotifications(user.id)
      setNotifications(data)
    } catch (err) {
      console.error('[NotificationsPage] Erreur chargement:', err)
      setError('Impossible de charger les notifications.')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  // ── Abonnement Realtime — nouvelles notifications en temps réel ──────────
  useEffect(() => {
    if (!user?.id) return

    const channel = subscribeToNotifications(user.id, (newNotif) => {
      // Ajouter au début de la liste
      setNotifications((prev) => [newNotif, ...prev])
      // Afficher le toast
      setToastNotif(newNotif)
    })

    return () => {
      channel.unsubscribe()
    }
  }, [user?.id])

  // ── Marquer une notif comme lue ───────────────────────────────────────────
  const handleMarkRead = useCallback(async (notifId) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    )
    try {
      await markNotificationRead(notifId)
    } catch (err) {
      console.warn('[NotificationsPage] Erreur markRead:', err)
      // Rollback en cas d'erreur
      setNotifications((prev) =>
        prev.map((n) => (n.id === notifId ? { ...n, read: false } : n))
      )
    }
  }, [])

  // ── Tout marquer comme lu ─────────────────────────────────────────────────
  const handleMarkAllRead = useCallback(async () => {
    if (!user?.id || markingAll) return
    setMarkingAll(true)
    // Optimistic update
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    try {
      await markAllNotificationsRead(user.id)
    } catch (err) {
      console.warn('[NotificationsPage] Erreur markAllRead:', err)
      // Recharger en cas d'erreur
      loadNotifications()
    } finally {
      setMarkingAll(false)
    }
  }, [user?.id, markingAll, loadNotifications])

  // ── Filtrage par onglet ───────────────────────────────────────────────────
  const activeTabConfig = NOTIF_TABS.find((t) => t.label === activeTab) ?? NOTIF_TABS[0]
  const filtered = notifications.filter((n) => {
    if (!activeTabConfig.filter) return true
    return activeTabConfig.filter.includes(n.type)
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">

      {/* Toast temps réel */}
      {toastNotif && (
        <NewNotifToast
          notif={toastNotif}
          onDismiss={() => setToastNotif(null)}
        />
      )}

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold font-display text-[#0b1c30]">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full
                           text-white text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #ec4899, #8127cf)' }}
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </div>
          <p className="text-[#7e7385] mt-1 text-sm">
            Restez informé de votre progression et de vos réussites.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="flex items-center gap-1 text-[#8127cf] text-sm font-bold
                       hover:underline transition-colors disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            {markingAll ? 'En cours...' : 'Tout marquer comme lu'}
          </button>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {NOTIF_TABS.map((tab) => {
          // Compter les non lues par onglet
          const tabUnread = notifications.filter((n) => {
            if (!n.read === false) return false
            if (!tab.filter) return !n.read
            return !n.read && tab.filter.includes(n.type)
          }).length

          return (
            <button
              key={tab.label}
              onClick={() => setActiveTab(tab.label)}
              className={`relative px-6 py-2.5 rounded-full text-sm font-bold
                          whitespace-nowrap transition-all
                          ${activeTab === tab.label
                            ? 'bg-[#8127cf] text-white shadow-md shadow-[#8127cf]/20'
                            : 'bg-white text-[#7e7385] border border-[#cfc2d6]/30 hover:bg-[#f0dbff]/50'
                          }`}
            >
              {tab.label}
              {tabUnread > 0 && (
                <span
                  className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px]
                               font-bold flex items-center justify-center
                               ${activeTab === tab.label ? 'bg-white text-[#8127cf]' : 'bg-[#8127cf] text-white'}`}
                >
                  {tabUnread}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Contenu ─────────────────────────────────────────────────────────── */}
      {loading ? (
        <NotifSkeleton />
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <span className="material-symbols-outlined text-[48px] text-[#cfc2d6]">error</span>
          <p className="text-[#7e7385] font-bold">{error}</p>
          <button
            onClick={loadNotifications}
            className="px-6 py-2 rounded-xl text-white text-sm font-bold"
            style={{ background: 'linear-gradient(135deg, #ec4899, #8127cf)' }}
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <EmptyState tab={activeTab} />
          ) : (
            filtered.map((notif) => (
              <NotifCard
                key={notif.id}
                notif={notif}
                onRead={handleMarkRead}
              />
            ))
          )}
        </div>
      )}

      {/* ── Banner bas ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-[#0b1c30] text-white">
        <div className="relative z-10 max-w-md">
          <h3 className="text-xl font-bold font-display mb-2">
            Maîtrisez l'IA avec IAAI
          </h3>
          <p className="text-white/70 text-sm mb-6">
            Saviez-vous que les apprenants qui suivent leurs notifications
            terminent leur parcours 2× plus vite ?
          </p>
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#8127cf]
                       font-bold rounded-xl text-sm hover:bg-[#f0dbff] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
            Paramétrer mes alertes
          </Link>
        </div>
        <div
          className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none
                     bg-gradient-to-l from-[#8127cf] to-transparent"
        />
      </div>

    </div>
  )
}