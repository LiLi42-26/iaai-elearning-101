// src/pages/Profile/ProfilePage.jsx
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées ─────────────────────────────────────────────────────────
const stats = [
  { value: '40%',     label: 'Progression globale',    color: 'text-[#8127cf]', border: 'border-[#8127cf]/10' },
  { value: '6h 45min', label: 'Temps apprentissage',   color: 'text-blue-600',  border: 'border-blue-100'     },
  { value: '3/7',     label: 'Quiz réussis',            color: 'text-pink-600',  border: 'border-pink-100'     },
  { value: '1',       label: 'Badge obtenu',            color: 'text-yellow-500', border: 'border-yellow-100'  },
]

const badges = [
  { icon: 'rocket_launch', label: 'AI Explorer',  status: 'done',   bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { icon: 'code',          label: 'Code Starter', status: 'locked', bg: 'bg-[#e5eeff]',  text: 'text-[#7e7385]'  },
  { icon: 'trophy',        label: 'Quiz Master',  status: 'locked', bg: 'bg-[#e5eeff]',  text: 'text-[#7e7385]'  },
]

const activity = [
  { icon: 'check_circle', bg: 'bg-green-100',  text: 'text-green-600',  title: 'Quiz terminé — Concepts de base 95%', time: 'Il y a 1 heure'  },
  { icon: 'play_circle',  bg: 'bg-blue-100',   text: 'text-blue-600',   title: 'Leçon vue — Les conditions',           time: 'Hier'            },
  { icon: 'emoji_events', bg: 'bg-yellow-100', text: 'text-yellow-600', title: 'Module 2 terminé !',                   time: 'Il y a 2 jours'  },
  { icon: 'check_circle', bg: 'bg-green-100',  text: 'text-green-600',  title: 'Quiz terminé — Module 1',              time: 'Il y a 3 jours'  },
]

export default function ProfilePage() {
  const { user } = useAuthStore()
  const fullName = user?.fullName || 'Ahmed M.'
  const email = user?.email || 'ahmed.m@exemple.ma'
  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="pb-12">

      {/* ── Titre ───────────────────────────────────────────────────────────── */}
      <h2 className="text-3xl font-bold font-display text-[#0b1c30] mb-6">
        Mon Profil
      </h2>

      {/* ── Header card ─────────────────────────────────────────────────────── */}
      <section className="bg-white/70 backdrop-blur-md border border-white/50
                          rounded-2xl p-8 flex flex-col md:flex-row items-center
                          gap-8 shadow-sm mb-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full flex items-center justify-center
                          text-white text-4xl font-bold"
               style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
            {initials}
          </div>
          <button className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-white
                             border border-[#cfc2d6] flex items-center justify-center
                             shadow-sm hover:bg-[#f0dbff] transition-colors">
            <span className="material-symbols-outlined text-[#8127cf] text-[18px]">edit</span>
          </button>
        </div>

        {/* Infos */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h3 className="text-2xl font-bold font-display text-[#0b1c30]">{fullName}</h3>
            <span className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-xs font-bold">
              Plan Gratuit
            </span>
          </div>
          <p className="text-[#7e7385] text-sm mb-1">{email}</p>
          <p className="text-xs text-[#7e7385]/70">Membre depuis Janvier 2026</p>
        </div>

        {/* Bouton modifier */}
        <button
          className="px-8 py-3 rounded-full text-white font-bold text-sm
                     hover:shadow-lg hover:shadow-[#8127cf]/20 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
        >
          Modifier mon profil
        </button>
      </section>

      {/* ── Stats ───────────────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <div key={i}
               className={`bg-white rounded-xl p-6 border ${stat.border} flex flex-col gap-1`}>
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
            <span className="text-xs text-[#7e7385]">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* ── Layout 2 colonnes ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Colonne gauche (2/3) ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 flex flex-col gap-6">

          {/* Mon parcours */}
          <section className="bg-white rounded-2xl p-8 border border-[#8127cf]/10 shadow-sm">
            <h4 className="text-xl font-bold font-display text-[#0b1c30] mb-6">
              Mon Parcours
            </h4>
            <div className="flex flex-col gap-4">
              <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{
                    width: '40%',
                    background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                  }}
                />
              </div>
              <div className="flex justify-between items-center text-[#7e7385]">
                <span className="text-sm">15/38 leçons terminées · 2/7 modules complétés</span>
                <span className="text-sm font-bold text-[#8127cf]">40%</span>
              </div>
              <div className="mt-4 pt-4 border-t border-[#f0f0f5] flex justify-end">
                <Link
                  to={ROUTES.CURRICULUM}
                  className="px-6 py-2.5 rounded-xl text-white font-bold text-sm
                             flex items-center gap-2 hover:shadow-md transition-all"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
                >
                  Continuer mon parcours
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Mes Badges */}
          <section className="bg-white rounded-2xl p-8 border border-[#8127cf]/10 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-bold font-display text-[#0b1c30]">Mes Badges</h4>
              <button className="text-[#8127cf] text-sm font-bold hover:underline">
                Voir tout
              </button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {badges.map((badge, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center text-center gap-3 p-4
                              rounded-xl bg-[#f8f5ff]/50
                              ${badge.status === 'locked' ? 'grayscale opacity-60' : ''}`}
                >
                  <div className={`w-16 h-16 rounded-full ${badge.bg}
                                  flex items-center justify-center ${badge.text}`}>
                    <span className="material-symbols-outlined text-[32px]">{badge.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold text-[#0b1c30] text-sm">{badge.label}</p>
                    <span className={`text-xs font-bold
                                     ${badge.status === 'done'
                                       ? 'text-green-600'
                                       : 'text-[#7e7385]'}`}>
                      {badge.status === 'done' ? 'Obtenu' : 'Verrouillé'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* ── Colonne droite (1/3) ─────────────────────────────────────────────── */}
        <section className="bg-white rounded-2xl p-8 border border-[#8127cf]/10
                            shadow-sm flex flex-col gap-6">
          <h4 className="text-xl font-bold font-display text-[#0b1c30]">
            Activité récente
          </h4>
          <div className="flex flex-col gap-6">
            {activity.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className={`mt-1 w-8 h-8 rounded-full ${item.bg}
                                flex items-center justify-center ${item.text} flex-shrink-0`}>
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#0b1c30]">{item.title}</span>
                  <span className="text-xs text-[#7e7385]">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* ARIA FAB */}
      <button
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full text-white
                   shadow-2xl flex items-center justify-center
                   hover:scale-110 active:scale-90 transition-all z-50 group relative"
        style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
      >
        <span className="material-symbols-outlined text-[32px]">chat</span>
        <span className="absolute right-full mr-4 bg-[#0b1c30] text-white px-4 py-2
                         rounded-lg text-xs opacity-0 group-hover:opacity-100
                         transition-opacity whitespace-nowrap pointer-events-none">
          Discute avec ARIA
        </span>
      </button>

    </div>
  )
}