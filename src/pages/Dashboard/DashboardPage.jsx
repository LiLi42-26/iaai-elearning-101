// src/pages/Dashboard/DashboardPage.jsx
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées (à remplacer par Supabase plus tard) ────────────────────
const stats = [
  { icon: 'timer',         color: 'cyan',    border: 'border-cyan-400',   bg: 'bg-cyan-50',    text: 'text-cyan-500',   label: "Temps d'étude",  value: '6h 45min' },
  { icon: 'menu_book',     color: 'primary', border: 'border-violet-600', bg: 'bg-violet-50',  text: 'text-violet-600', label: 'Leçons finies',  value: '15 leçons' },
  { icon: 'task_alt',      color: 'pink',    border: 'border-pink-600',   bg: 'bg-pink-50',    text: 'text-pink-600',   label: 'Quiz réussis',   value: '3 quiz' },
  { icon: 'rocket_launch', color: 'purple',  border: 'border-purple-500', bg: 'bg-purple-50',  text: 'text-purple-500', label: 'Badges gagnés',  value: '1 badge' },
]

const recentActivity = [
  { icon: 'check_circle', bg: 'bg-green-50',  text: 'text-green-600', title: 'Quiz terminé — Concepts de base',        time: 'Il y a 1h',     extra: '95%',      extraClass: 'text-green-600 font-bold' },
  { icon: 'play_circle',  bg: 'bg-blue-50',   text: 'text-blue-600',  title: "Leçon vue — Qu'est-ce qu'un algorithme ?", time: 'Hier',          extra: 'Module 2', extraClass: 'text-[#7e7385]' },
  { icon: 'emoji_events', bg: 'bg-purple-50', text: 'text-purple-600', title: ' Module 2 terminé !',                  time: 'Il y a 2 jours', extra: '',         extraClass: '' },
  { icon: 'check_circle', bg: 'bg-green-50',  text: 'text-green-600', title: 'Quiz terminé',                            time: 'Il y a 3 jours', extra: '',         extraClass: '' },
  { icon: 'play_circle',  bg: 'bg-blue-50',   text: 'text-blue-600',  title: 'Leçon vue',                               time: 'Il y a 5 jours', extra: '',         extraClass: '' },
]

const roadmap = [
  { title: "Module 1 : Qu'est-ce que l'IA ?",                       status: 'done',    progress: 100 },
  { title: 'Module 2 : Comment les ordinateurs prennent des décisions', status: 'done', progress: 100 },
  { title: 'Module 3 : Concepts de programmation',                   status: 'active',  progress: 60  },
  { title: 'Modules 4 à 7',                                          status: 'locked',  progress: 0   },
]

export default function DashboardPage() {
  const { user } = useAuthStore()
  const firstName = user?.fullName?.split(' ')[0] || 'Ahmed'

  return (
    <div className="min-h-screen bg-[#f8f5ff] pb-12">

      {/* ── Row 1 : Welcome Banner + Objectif ───────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6 mb-6">

        {/* Welcome Banner */}
        <div className="col-span-12 lg:col-span-7 bg-gradient-to-br from-[#8127cf] to-[#9c48ea]
                        rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold font-display mb-2">
              Bonjour {firstName} 
            </h2>
            <p className="text-base opacity-90 mb-6">
              Vous faites d'excellents progrès. Continuez ainsi !
            </p>
            <div className="mb-6 max-w-sm">
              <div className="flex justify-between text-xs mb-2">
                <span>Progression du cours</span>
                <span>40% (15/38 leçons)</span>
              </div>
              <div className="h-2 w-full bg-white/20 rounded-full">
                <div className="h-full bg-white rounded-full" style={{ width: '40%' }} />
              </div>
            </div>
            <Link
              to={ROUTES.CURRICULUM}
              className="inline-flex items-center gap-2 bg-white text-[#8127cf]
                         px-6 py-3 rounded-full font-bold text-sm hover:bg-purple-50 transition-colors"
            >
              Continuer l'apprentissage
              <span className="material-symbols-outlined text-[20px]">play_arrow</span>
            </Link>
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute right-10 bottom-0 w-48 h-48 opacity-10">
            <span className="material-symbols-outlined text-[180px]">auto_awesome</span>
          </div>
        </div>

        {/* Objectif hebdomadaire */}
        <div className="col-span-12 lg:col-span-5 bg-white/70 backdrop-blur-md
                        border border-white/50 rounded-2xl p-8
                        flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-4">
            Objectif Hebdomadaire
          </h3>
          <div className="relative w-32 h-32 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="58" fill="transparent"
                      stroke="#d3e4fe" strokeWidth="8" />
              <circle cx="64" cy="64" r="58" fill="transparent"
                      stroke="#8127cf" strokeWidth="8"
                      strokeDasharray="364.4"
                      strokeDashoffset="145.76" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-[#8127cf]">60%</span>
            </div>
          </div>
          <p className="text-sm font-medium text-[#0b1c30] mb-1">Terminer le Module 3</p>
          <p className="text-xs text-[#7e7385]">Plus que 2 leçons pour cette semaine !</p>
        </div>

      </div>

      {/* ── Row 2 : Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, i) => (
          <div key={i}
               className={`bg-white/70 backdrop-blur-md border border-white/50
                           rounded-2xl p-6 border-l-4 ${stat.border}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined ${stat.text}`}>{stat.icon}</span>
              </div>
              <div>
                <p className="text-xs text-[#7e7385]">{stat.label}</p>
                <p className="text-xl font-bold text-[#0b1c30]">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Row 3 : Continuer + Feuille de route ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Continuer la leçon */}
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden flex flex-col">
          <div className="h-48 relative bg-gradient-to-br from-purple-400 to-cyan-400">
            <div className="absolute top-4 left-4 bg-[#8127cf] text-white text-[10px]
                            font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              En cours
            </div>
          </div>
          <div className="p-6 flex flex-col flex-1">
            <h4 className="text-lg font-bold text-[#0b1c30] mb-1">
              Variables et Types de données
            </h4>
            <p className="text-xs text-[#7e7385] mb-6">
              Module 3 : Fondamentaux de Python pour l'IA
            </p>
            <div className="mt-auto">
              <div className="flex justify-between text-xs mb-2">
                <span>Progression de la leçon</span>
                <span>60%</span>
              </div>
              <div className="h-1.5 w-full bg-[#e5eeff] rounded-full mb-6">
                <div className="h-full bg-[#8127cf] rounded-full" style={{ width: '60%' }} />
              </div>
              <Link
                to={ROUTES.CURRICULUM}
                className="w-full py-3 rounded-xl border border-[#8127cf] text-[#8127cf]
                           font-bold hover:bg-purple-50 transition-colors
                           flex items-center justify-center gap-2 text-sm"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                Reprendre la leçon
              </Link>
            </div>
          </div>
        </div>

        {/* Feuille de route */}
        <div className="bg-white/70 backdrop-blur-md border border-white/50 rounded-2xl p-6">
          <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-6">
            Feuille de route
          </h3>
          <div className="space-y-4">
            {roadmap.map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {item.status === 'done' && (
                    <div className="w-6 h-6 rounded-full bg-[#8127cf] flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  )}
                  {item.status === 'active' && (
                    <div className="w-6 h-6 rounded-full border-2 border-[#8127cf] flex items-center justify-center bg-white">
                      <div className="w-2 h-2 rounded-full bg-[#8127cf]" />
                    </div>
                  )}
                  {item.status === 'locked' && (
                    <div className="w-6 h-6 rounded-full bg-[#e5eeff] flex items-center justify-center text-[#7e7385]">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                    </div>
                  )}
                  {i < roadmap.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 ${item.status === 'locked' ? 'bg-[#e5eeff]' : 'bg-[#8127cf]'}`} />
                  )}
                </div>
                <div className={`pb-4 ${item.status === 'locked' ? 'opacity-40' : ''}`}>
                  <p className={`text-sm font-bold ${item.status === 'active' ? 'text-[#8127cf]' : 'text-[#0b1c30]'}`}>
                    {item.title}
                  </p>
                  {item.status === 'done' && (
                    <p className="text-xs text-[#7e7385]">Terminé ✓</p>
                  )}
                  {item.status === 'active' && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-1 bg-[#e5eeff] rounded-full">
                        <div className="h-full bg-[#8127cf] rounded-full" style={{ width: `${item.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-[#7e7385]">En cours · {item.progress}%</span>
                    </div>
                  )}
                  {item.status === 'locked' && (
                    <p className="text-xs text-[#7e7385]">À venir</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 4 : Badges + Activité récente ───────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6 mb-6">

        {/* Badges */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-6"> Mes badges</h3>
          <div className="grid grid-cols-3 gap-4">
            {/* Badge gagné */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500
                              flex items-center justify-center text-white shadow-md mb-2">
                <span className="material-symbols-outlined text-[32px]">rocket_launch</span>
              </div>
              <p className="text-[10px] font-bold text-[#0b1c30]">AI Explorer</p>
            </div>
            {/* Badge verrouillé */}
            {['code', 'emoji_events'].map((icon, i) => (
              <div key={i} className="flex flex-col items-center text-center opacity-30 grayscale">
                <div className="w-16 h-16 rounded-full bg-[#e5eeff] flex items-center justify-center
                                text-[#7e7385] border-2 border-dashed border-[#7e7385]/50 mb-2">
                  <span className="material-symbols-outlined text-[32px]">{icon}</span>
                </div>
                <p className="text-[10px] font-bold text-[#0b1c30]">
                  {i === 0 ? 'Code Starter' : 'Quiz Master'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-purple-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-4"> Activité récente</h3>
          <div className="space-y-3">
            {recentActivity.map((item, i) => (
              <div key={i}
                   className={`flex items-center justify-between py-2
                               ${i < recentActivity.length - 1 ? 'border-b border-[#cfc2d6]/20' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${item.bg} ${item.text}`}>
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0b1c30]">{item.title}</p>
                    <p className="text-xs text-[#7e7385]">{item.time}</p>
                  </div>
                </div>
                {item.extra && (
                  <span className={`text-sm ${item.extraClass}`}>{item.extra}</span>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Row 5 : Recommandations ──────────────────────────────────────────── */}
      <div>
        <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-6">
           Recommandé pour vous
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { icon: 'video_library', bg: 'bg-[#f0dbff]', text: 'text-[#8127cf]', title: 'Variables et Types de données',    sub: 'Module 3 · 15 min',      btn: 'Commencer' },
            { icon: 'edit_square',   bg: 'bg-[#ffd9e4]', text: 'text-[#b4136d]', title: 'Quiz — Bases de programmation',    sub: '10 questions · 8 min',   btn: 'Faire le quiz' },
          ].map((item, i) => (
            <div key={i}
                 className="bg-white border border-purple-100 p-6 rounded-2xl
                            flex items-center gap-6 shadow-sm hover:shadow-md transition-all group">
              <div className={`w-20 h-20 rounded-2xl ${item.bg} flex items-center justify-center ${item.text} flex-shrink-0`}>
                <span className="material-symbols-outlined text-[40px]">{item.icon}</span>
              </div>
              <div className="flex-1">
                <h4 className="text-base font-bold text-[#0b1c30] group-hover:text-[#8127cf] transition-colors mb-1">
                  {item.title}
                </h4>
                <p className="text-xs text-[#7e7385] mb-3">{item.sub}</p>
                <Link
                  to={ROUTES.CURRICULUM}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white
                             text-xs font-bold transition-all"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
                >
                  {item.btn}
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}