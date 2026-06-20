// src/pages/Notifications/NotificationsPage.jsx
import { useState } from 'react'

const notificationsData = [
  {
    id: 1,
    icon: 'school',
    iconBg: 'bg-[#f0dbff]',
    iconText: 'text-[#8127cf]',
    title: 'Nouveau module débloqué : Concepts de programmation Python',
    body: "Félicitations ! Vous avez terminé le module d'introduction. Les structures de contrôle vous attendent.",
    time: 'Il y a 2 heures',
    isNew: true,
    read: false,
    type: 'cours',
    actions: false,
  },
  {
    id: 2,
    icon: 'chat',
    iconBg: 'bg-cyan-50',
    iconText: 'text-cyan-500',
    title: 'Réponse à votre question : "Comment fonctionne une boucle for ?"',
    body: "L'instructeur Dr. Karim a répondu à votre fil de discussion dans le forum Python 101.",
    time: 'Il y a 5 heures',
    isNew: false,
    read: false,
    type: 'communauté',
    actions: false,
  },
  {
    id: 3,
    icon: 'military_tech',
    iconBg: 'bg-pink-50',
    iconText: 'text-pink-600',
    title: "Félicitations ! Vous avez obtenu le badge 'Apprenti Python'",
    body: "Votre assiduité porte ses fruits. Ce badge a été ajouté à votre profil public.",
    time: 'Hier, à 14:30',
    isNew: false,
    read: true,
    type: 'badges',
    actions: false,
  },
  {
    id: 4,
    icon: 'warning',
    iconBg: 'bg-red-50',
    iconText: 'text-red-500',
    title: "Rappel : Vous n'avez pas étudié depuis 2 jours",
    body: "Ne laissez pas votre série de 12 jours s'éteindre ! Reprenez votre parcours dès maintenant.",
    time: 'Il y a 1 jour',
    isNew: false,
    read: true,
    type: 'cours',
    actions: true,
  },
]

const tabs = ['Toutes', 'Cours', 'Communauté', 'Badges & XP']

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState('Toutes')
  const [notifications, setNotifications] = useState(notificationsData)

  const unreadCount = notifications.filter(n => !n.read).length

  const filtered = notifications.filter(n => {
    if (activeTab === 'Cours') return n.type === 'cours'
    if (activeTab === 'Communauté') return n.type === 'communauté'
    if (activeTab === 'Badges & XP') return n.type === 'badges'
    return true
  })

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true, isNew: false })))
  }

  const markRead = (id) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true, isNew: false } : n
    ))
  }

  return (
    <div className="max-w-4xl mx-auto pb-12 space-y-8">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold font-display text-[#0b1c30]">Notifications</h2>
          <p className="text-[#7e7385] mt-1 text-sm">
            Restez informé de votre progression et de la communauté.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1 text-[#8127cf] text-sm font-bold
                       hover:underline transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            Tout marquer comme lu
          </button>
        )}
      </div>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap
                        transition-all
                        ${activeTab === tab
                          ? 'bg-[#8127cf] text-white shadow-md shadow-[#8127cf]/20'
                          : 'bg-white text-[#7e7385] border border-[#cfc2d6]/30 hover:bg-[#f0dbff]/50'
                        }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Liste des notifications ──────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-16 text-[#7e7385]">
            <span className="material-symbols-outlined text-[48px] mb-4 block opacity-40">
              notifications_off
            </span>
            <p className="font-bold">Aucune notification dans cette catégorie</p>
          </div>
        )}

        {filtered.map((notif) => (
          <div
            key={notif.id}
            onClick={() => markRead(notif.id)}
            className={`group flex items-start gap-4 p-5 rounded-2xl cursor-pointer
                        transition-all hover:translate-x-1
                        ${!notif.read
                          ? 'bg-[#8127cf]/5 border-l-4 border-l-[#8127cf] border border-[#8127cf]/10 shadow-sm hover:shadow-md'
                          : 'bg-white border border-[#f0f0f5] hover:shadow-md'
                        }`}
          >
            {/* Icône */}
            <div className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center
                            justify-center ${notif.iconBg} ${notif.iconText}`}>
              <span className="material-symbols-outlined text-[28px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}>
                {notif.icon}
              </span>
            </div>

            {/* Contenu */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start gap-2 mb-1">
                <h4 className="text-sm font-bold text-[#0b1c30] leading-snug">
                  {notif.title}
                </h4>
                {notif.isNew && (
                  <span className="text-xs font-bold text-[#8127cf] bg-[#f0dbff]
                                   px-2 py-0.5 rounded-full flex-shrink-0">
                    Nouveau
                  </span>
                )}
              </div>
              <p className="text-sm text-[#7e7385]">{notif.body}</p>

              {/* Actions si applicable */}
              {notif.actions && (
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-1.5 bg-[#8127cf] text-white text-xs font-bold
                               rounded-lg hover:bg-[#6900b3] transition-colors"
                  >
                    Reprendre
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-1.5 border border-[#cfc2d6]/30 text-[#7e7385]
                               text-xs font-bold rounded-lg hover:bg-[#f0f0f5] transition-colors"
                  >
                    Plus tard
                  </button>
                </div>
              )}

              <p className="text-xs text-[#7e7385] mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">schedule</span>
                {notif.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Banner bas ───────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-[#0b1c30] text-white">
        <div className="relative z-10 max-w-md">
          <h3 className="text-xl font-bold font-display mb-2">
            Maîtrisez l'IA avec nous
          </h3>
          <p className="text-white/70 text-sm mb-6">
            Saviez-vous que 80% des apprenants qui activent leurs notifications
            terminent leur cursus ?
          </p>
          <button className="flex items-center gap-2 px-6 py-3 bg-white text-[#8127cf]
                             font-bold rounded-xl text-sm hover:bg-[#f0dbff] transition-colors">
            <span className="material-symbols-outlined text-[18px]">settings_suggest</span>
            Paramétrer mes alertes
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-20 pointer-events-none
                        bg-gradient-to-l from-[#8127cf] to-transparent" />
      </div>

    </div>
  )
}