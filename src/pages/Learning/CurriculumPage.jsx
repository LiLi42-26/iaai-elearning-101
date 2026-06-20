// src/pages/Learning/CurriculumPage.jsx
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées des 7 modules ──────────────────────────────────────────
const modules = [
  {
    id: 1,
    title: "Qu'est-ce que l'Intelligence Artificielle ?",
    duration: '5 leçons · ~2h',
    status: 'done',
    progress: 100,
    lessons: [
      { title: "L'IA, c'est quoi exactement ?",     done: true },
      { title: "Histoire de l'IA en 5 minutes",      done: true },
      { title: "L'IA dans notre quotidien",           done: true },
      { title: "Les types d'IA",                      done: true },
      { title: 'Quiz — Concepts de base',             done: true },
    ],
  },
  {
    id: 2,
    title: 'Comment les ordinateurs prennent des décisions',
    duration: '5 leçons · ~2h',
    status: 'done',
    progress: 100,
    lessons: [
      { title: "Les algorithmes au quotidien",        done: true },
      { title: "Logique et conditions",               done: true },
      { title: "Les arbres de décision",              done: true },
      { title: "Exemples concrets",                   done: true },
      { title: "Quiz — Prise de décision",            done: true },
    ],
  },
  {
    id: 3,
    title: 'Concepts de programmation pour l\'IA',
    duration: '6 leçons · ~2h30',
    status: 'active',
    progress: 60,
    lessons: [
      { title: "Introduction à Python",              done: true },
      { title: "Variables et Types de données",      done: true },
      { title: "Les listes et dictionnaires",        done: true },
      { title: "Fonctions et boucles",               done: false },
      { title: "Bibliothèques IA (NumPy, Pandas)",   done: false },
      { title: "Quiz — Programmation de base",       done: false },
    ],
  },
  {
    id: 4,
    title: 'Les données : carburant de l\'IA',
    duration: '5 leçons · ~2h',
    status: 'locked',
    progress: 0,
    unlockAfter: 'Terminez le Module 3 pour débloquer',
    lessons: [
      { title: "Qu'est-ce qu'une donnée ?",          done: false },
      { title: "Types de données",                   done: false },
      { title: "Collecter et nettoyer les données",  done: false },
      { title: "Analyser les données",               done: false },
      { title: "Mini projet données",                done: false },
    ],
  },
  {
    id: 5,
    title: 'Réseaux de neurones expliqués simplement',
    duration: '5 leçons · ~2h',
    status: 'locked',
    progress: 0,
    unlockAfter: 'Terminez le Module 4 pour débloquer',
    lessons: [
      { title: "Le cerveau humain vs l'IA",          done: false },
      { title: "Structure d'un neurone artificiel",  done: false },
      { title: "Comment un réseau apprend",          done: false },
      { title: "Deep Learning en pratique",          done: false },
      { title: "Quiz — Réseaux de neurones",         done: false },
    ],
  },
  {
    id: 6,
    title: 'Introduction au Machine Learning',
    duration: '6 leçons · ~2h30',
    status: 'locked',
    progress: 0,
    unlockAfter: 'Terminez le Module 5 pour débloquer',
    lessons: [
      { title: "C'est quoi le Machine Learning ?",   done: false },
      { title: "Comment une machine apprend ?",      done: false },
      { title: "Les données d'entraînement",         done: false },
      { title: "Votre premier modèle",               done: false },
      { title: "Tester et améliorer",                done: false },
      { title: "Mini projet ML",                     done: false },
    ],
  },
  {
    id: 7,
    title: 'Premier projet IA guidé',
    duration: '3 leçons · ~1h30',
    status: 'locked',
    progress: 0,
    unlockAfter: 'Terminez le Module 6 pour débloquer',
    lessons: [
      { title: "Définir votre projet IA",            done: false },
      { title: "Construire étape par étape",         done: false },
      { title: "Présenter et valider votre projet",  done: false },
    ],
  },
]

// ─── Badge de statut ─────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (status === 'done') return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600
                    rounded-full text-xs font-bold">
      <span className="material-symbols-outlined text-[16px]">check_circle</span>
      TERMINÉ
    </div>
  )
  if (status === 'active') return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#f0dbff] text-[#8127cf]
                    rounded-full text-xs font-bold">
      <span className="material-symbols-outlined text-[16px]">play_circle</span>
      EN COURS
    </div>
  )
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 bg-[#e5eeff] text-[#7e7385]
                    rounded-full text-xs font-bold">
      <span className="material-symbols-outlined text-[16px]">lock</span>
      VERROUILLÉ
    </div>
  )
}

export default function CurriculumPage() {
  return (
    <div className="min-h-screen bg-[#f8f5ff] pb-12">

      {/* ── Hero Header ─────────────────────────────────────────────────────── */}
      <section className="bg-white border border-[#8127cf]/10 rounded-2xl p-10
                          relative overflow-hidden mb-10">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#8127cf]/5 rounded-full blur-[80px]" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 bg-[#b4136d]/5 rounded-full blur-[60px]" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-6 flex-1">
            <div>
              <h2 className="text-4xl font-bold font-display text-[#0b1c30] mb-2 tracking-tight">
                AI Foundations 101
              </h2>
              <p className="text-lg text-[#4d4354]">
                Votre parcours complet vers la maîtrise de l'IA
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: 'signal_cellular_alt', color: 'text-[#8127cf] bg-[#f0dbff]',   label: 'Débutant' },
                { icon: 'category',            color: 'text-cyan-500 bg-cyan-50',       label: '7 modules' },
                { icon: 'menu_book',           color: 'text-[#b4136d] bg-pink-50',     label: '38 leçons' },
                { icon: 'schedule',            color: 'text-[#4d4354] bg-[#e5eeff]',   label: '~17h' },
              ].map((badge, i) => (
                <span key={i}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold
                                  flex items-center gap-2 ${badge.color}`}>
                  <span className="material-symbols-outlined text-[16px]">{badge.icon}</span>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>

          {/* Progression globale */}
          <div className="w-full md:w-96 space-y-4">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-xs text-[#7e7385] uppercase font-bold tracking-wider">
                  Progression globale
                </p>
                <p className="text-sm font-semibold text-[#0b1c30]">
                  40% complété{' '}
                  <span className="text-[#7e7385] font-normal">· 15/38 leçons</span>
                </p>
              </div>
              <span className="text-2xl font-bold text-[#8127cf]">40%</span>
            </div>
            <div className="h-3 w-full bg-[#e5eeff] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: '40%',
                  background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Liste des modules ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6">
        {modules.map((mod) => (
          <div
            key={mod.id}
            className={`bg-white border rounded-2xl p-8 shadow-sm transition-all
                        ${mod.status === 'locked'
                          ? 'opacity-70 border-[#8127cf]/5'
                          : 'border-[#8127cf]/10 hover:border-[#8127cf]/30'}`}
          >
            {/* Header du module */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className={`text-xl font-bold font-display mb-1
                                ${mod.status === 'locked' ? 'text-[#0b1c30]/60' : 'text-[#0b1c30]'}`}>
                  Module {mod.id} — {mod.title}
                </h3>
                <p className="text-sm text-[#7e7385]">{mod.duration}</p>
              </div>
              <StatusBadge status={mod.status} />
            </div>

            {/* Liste des leçons */}
            <div className={`space-y-3 mb-8 ${mod.status === 'locked' ? 'opacity-40' : ''}`}>
              {mod.lessons.map((lesson, i) => (
                <div key={i} className="flex items-center gap-3 text-[#4d4354]">
                  <span className={`material-symbols-outlined text-[20px]
                                   ${lesson.done
                                     ? 'text-green-500'
                                     : mod.status === 'locked'
                                       ? 'text-[#7e7385]'
                                       : 'text-[#cfc2d6]'}`}>
                    {lesson.done ? 'check_circle' : mod.status === 'locked' ? 'lock' : 'radio_button_unchecked'}
                  </span>
                  <span className="text-sm">{lesson.title}</span>
                </div>
              ))}
            </div>

            {/* Footer du module */}
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 w-full">
                <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${mod.status === 'done' ? 'bg-green-500' : 'bg-[#8127cf]'}`}
                    style={{ width: `${mod.progress}%` }}
                  />
                </div>
                {mod.status === 'done' && (
                  <p className="text-xs text-green-600 font-bold uppercase">100% complété</p>
                )}
                {mod.status === 'active' && (
                  <p className="text-xs text-[#8127cf] font-bold uppercase">{mod.progress}% complété</p>
                )}
                {mod.status === 'locked' && (
                  <p className="text-xs text-[#7e7385]/70 font-bold uppercase">{mod.unlockAfter}</p>
                )}
              </div>

              {mod.status === 'done' && (
                <Link
                  to={ROUTES.MODULE(mod.id)}
                  className="px-6 py-2.5 border-2 border-[#8127cf] text-[#8127cf]
                             rounded-xl font-bold text-sm hover:bg-[#8127cf]/5
                             transition-colors whitespace-nowrap"
                >
                  Revoir le module
                </Link>
              )}
              {mod.status === 'active' && (
                <Link
                  to={ROUTES.MODULE(mod.id)}
                  className="px-8 py-2.5 rounded-xl text-white font-bold text-sm
                             whitespace-nowrap transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
                >
                  Continuer
                </Link>
              )}
              {mod.status === 'locked' && (
                <button
                  disabled
                  className="px-8 py-2.5 bg-[#e5eeff] text-[#7e7385]/50 rounded-xl
                             font-bold text-sm cursor-not-allowed whitespace-nowrap
                             flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                  Verrouillé
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Section Certificat ───────────────────────────────────────────────── */}
      <div className="mt-8 bg-[#eff4ff] rounded-2xl p-8 border border-[#8127cf]/5 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <span className="material-symbols-outlined text-[32px] text-[#8127cf]">workspace_premium</span>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold font-display text-[#0b1c30]">
                Certificat AI Foundations 101
              </h3>
              <p className="text-sm text-[#4d4354]">
                Terminez les 7 modules pour obtenir votre certificat reconnu
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-[#4d4354] text-sm">
              {['7 modules complétés', '38 leçons terminées', 'Partageable sur LinkedIn'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">
                    {i === 2 ? 'share' : 'check_circle'}
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <button
              disabled
              className="px-8 py-3 border-2 border-[#7e7385] text-[#7e7385]
                         rounded-xl font-bold text-sm cursor-not-allowed
                         flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
              Voir mon certificat
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}