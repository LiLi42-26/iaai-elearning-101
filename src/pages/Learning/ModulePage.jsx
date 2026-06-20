// src/pages/Learning/ModulePage.jsx
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées du module ───────────────────────────────────────────────
const moduleData = {
  3: {
    title: 'Concepts fondamentaux de programmation',
    status: 'active',
    progress: 60,
    duration: '2h30',
    lessonsCount: 6,
    objectives: [
      "Comprendre les variables et types de données",
      "Maîtriser les conditions et boucles",
      "Utiliser les fonctions en Python",
      "Manipuler des listes et dictionnaires",
      "Appliquer les concepts avec des exercices pratiques",
    ],
    lessons: [
      { id: 1, title: "Introduction à la programmation",   duration: '15 min', status: 'done'   },
      { id: 2, title: "Variables et Types de données",     duration: '20 min', status: 'done'   },
      { id: 3, title: "Les conditions — EN COURS",         duration: '25 min', status: 'active' },
      { id: 4, title: "Les boucles",                       duration: '20 min', status: 'locked' },
      { id: 5, title: "Les fonctions",                     duration: '25 min', status: 'locked' },
      { id: 6, title: "Mini projet",                       duration: '30 min', status: 'locked' },
    ],
  },
}

export default function ModulePage() {
  const { id } = useParams()
  const mod = moduleData[id] || moduleData[3]

  return (
    <div className="max-w-3xl mx-auto pb-12">

      {/* ── Retour ──────────────────────────────────────────────────────────── */}
      <Link
        to={ROUTES.CURRICULUM}
        className="inline-flex items-center gap-2 text-[#8127cf] text-sm font-medium
                   hover:gap-3 transition-all mb-6"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Retour au parcours
      </Link>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold font-display text-[#0b1c30] mb-6">
          Module {id} — {mod.title}
        </h2>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs rounded-full
                           flex items-center gap-2 font-bold">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            EN COURS
          </span>
          <div className="flex items-center gap-2 text-[#7e7385] text-sm">
            <span className="material-symbols-outlined text-[18px]">auto_stories</span>
            {mod.lessonsCount} leçons
          </div>
          <div className="flex items-center gap-2 text-[#7e7385] text-sm">
            <span className="material-symbols-outlined text-[18px]">schedule</span>
            {mod.duration}
          </div>
        </div>

        {/* Progression */}
        <div className="bg-white border border-[#8127cf]/10 rounded-2xl p-6">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="text-xs text-[#7e7385] uppercase font-bold tracking-wider mb-1">
                Progression du module
              </p>
              <p className="text-sm font-semibold text-[#0b1c30]">
                {mod.progress}% complété
              </p>
            </div>
            <span className="text-2xl font-bold text-[#8127cf]">{mod.progress}%</span>
          </div>
          <div className="h-3 w-full bg-[#e5eeff] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${mod.progress}%`,
                background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Objectifs ───────────────────────────────────────────────────────── */}
      <section className="mb-10">
        <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-6">
          Ce que vous allez apprendre
        </h3>
        <div className="bg-white border border-[#8127cf]/10 rounded-2xl p-6 space-y-3">
          {mod.objectives.map((obj, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="material-symbols-outlined text-[#8127cf] text-[20px] mt-0.5">
                check_circle
              </span>
              <p className="text-sm text-[#4d4354]">{obj}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Leçons ──────────────────────────────────────────────────────────── */}
      <section>
        <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-6">
          Les leçons
        </h3>
        <div className="flex flex-col gap-3">
          {mod.lessons.map((lesson, i) => (
            <div
              key={i}
              className={`bg-white border rounded-xl p-5 flex items-center justify-between
                          transition-all
                          ${lesson.status === 'locked'
                            ? 'border-[#8127cf]/5 opacity-60'
                            : 'border-[#8127cf]/10 hover:border-[#8127cf]/30'}`}
            >
              <div className="flex items-center gap-4">
                {/* Icône statut */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center
                                ${lesson.status === 'done'
                                  ? 'bg-green-50'
                                  : lesson.status === 'active'
                                    ? 'bg-[#f0dbff]'
                                    : 'bg-[#e5eeff]'}`}>
                  <span className={`material-symbols-outlined text-[20px]
                                   ${lesson.status === 'done'
                                     ? 'text-green-500'
                                     : lesson.status === 'active'
                                       ? 'text-[#8127cf]'
                                       : 'text-[#7e7385]'}`}>
                    {lesson.status === 'done'
                      ? 'check_circle'
                      : lesson.status === 'active'
                        ? 'play_circle'
                        : 'lock'}
                  </span>
                </div>

                {/* Titre + durée */}
                <div>
                  <p className={`text-sm font-semibold
                                ${lesson.status === 'active'
                                  ? 'text-[#8127cf]'
                                  : 'text-[#0b1c30]'}`}>
                    Leçon {i + 1} — {lesson.title}
                  </p>
                  <p className="text-xs text-[#7e7385]">{lesson.duration}</p>
                </div>
              </div>

              {/* Bouton action */}
              {lesson.status === 'done' && (
                <Link
                  to={ROUTES.LESSON(lesson.id)}
                  className="px-4 py-1.5 border border-[#8127cf] text-[#8127cf]
                             rounded-lg text-xs font-bold hover:bg-[#8127cf]/5 transition-colors"
                >
                  Revoir
                </Link>
              )}
              {lesson.status === 'active' && (
                <Link
                  to={ROUTES.LESSON(lesson.id)}
                  className="px-6 py-2 rounded-lg text-white text-xs font-bold
                             transition-all active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
                >
                  Continuer
                </Link>
              )}
              {lesson.status === 'locked' && (
                <span className="material-symbols-outlined text-[#7e7385] text-[20px]">
                  lock
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}