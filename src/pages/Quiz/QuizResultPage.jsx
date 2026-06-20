// src/pages/Quiz/QuizResultPage.jsx
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function QuizResultPage() {
  const { id } = useParams()
  const location = useLocation()

  // Données depuis la navigation (QuizPage) ou mockées
  const { score = 9, total = 10, quizTitle = 'Quiz — Concepts de programmation' } =
    location.state || {}

  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 70

  // ── Animation du score ───────────────────────────────────────────────────
  const [displayScore, setDisplayScore] = useState(0)

  useEffect(() => {
    let count = 0
    const target = percentage
    const duration = 1500
    const increment = target / (duration / 16)
    const counter = setInterval(() => {
      count += increment
      if (count >= target) {
        setDisplayScore(target)
        clearInterval(counter)
      } else {
        setDisplayScore(Math.floor(count))
      }
    }, 16)
    return () => clearInterval(counter)
  }, [percentage])

  // ── Cercle SVG ───────────────────────────────────────────────────────────
  const radius = 88
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative overflow-hidden">

      {/* Glows décoratifs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-[#8127cf]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Card principale */}
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-[#8127cf]/10
                      p-10 md:p-16 flex flex-col items-center text-center
                      relative z-10 shadow-sm">

        {/* Trophée */}
        <div className="relative mb-8">
          <div className={`w-32 h-32 flex items-center justify-center rounded-full
                          animate-bounce
                          ${passed ? 'bg-yellow-50' : 'bg-red-50'}`}>
            <span className={`material-symbols-outlined text-[80px]
                             ${passed ? 'text-yellow-500' : 'text-red-400'}`}>
              {passed ? 'emoji_events' : 'sentiment_dissatisfied'}
            </span>
          </div>
          {passed && (
            <>
              <div className="absolute -top-4 -right-4 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
              <div className="absolute bottom-0 -left-6 w-3 h-3 bg-pink-400 rounded-full animate-pulse" />
            </>
          )}
        </div>

        {/* Titre */}
        <h2 className={`text-3xl font-bold font-display mb-2
                        ${passed ? 'text-green-600' : 'text-red-500'}`}>
          {passed ? 'Félicitations !' : 'Presque !'}
        </h2>
        <p className="text-lg text-[#7e7385] mb-10">
          {passed
            ? `Vous avez réussi le ${quizTitle}`
            : `Vous n'avez pas atteint le score minimum (70%)`}
        </p>

        {/* Cercle score */}
        <div className="relative w-48 h-48 mb-10">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
            <defs>
              <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#a855f7" />
              </linearGradient>
            </defs>
            <circle
              cx="96" cy="96" r={radius}
              fill="transparent"
              stroke="#e5eeff"
              strokeWidth="8"
            />
            <circle
              cx="96" cy="96" r={radius}
              fill="transparent"
              stroke="url(#scoreGradient)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: 'stroke-dashoffset 1.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-bold text-[#8127cf]">{displayScore}%</span>
            <span className="text-xs text-[#7e7385] uppercase tracking-widest mt-1">
              Score Final
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 w-full mb-10
                        border-y border-[#cfc2d6]/20 py-8">
          {[
            { icon: 'task_alt',    value: `${score}/${total}`, label: 'Réponses correctes' },
            { icon: 'timer',       value: '06:12',              label: 'Temps total'        },
            { icon: 'trending_up', value: 'Top 5%',             label: 'Rang global'        },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <span className="material-symbols-outlined text-[#8127cf] text-[28px] mb-1">
                {stat.icon}
              </span>
              <span className="text-2xl font-bold text-[#0b1c30]">{stat.value}</span>
              <span className="text-xs text-[#7e7385]">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Boutons */}
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
          {passed ? (
            <Link
              to={ROUTES.CURRICULUM}
              className="px-8 py-4 rounded-full text-white font-bold text-sm
                         flex items-center justify-center gap-2
                         hover:shadow-lg active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
            >
              Continuer vers le Module 4
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </Link>
          ) : (
            <Link
              to={ROUTES.QUIZ(id)}
              className="px-8 py-4 rounded-full text-white font-bold text-sm
                         flex items-center justify-center gap-2
                         hover:shadow-lg active:scale-[0.98] transition-all"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
            >
              Réessayer le quiz
              <span className="material-symbols-outlined text-[18px]">refresh</span>
            </Link>
          )}

          <button
            className="px-8 py-4 border-2 border-[#8127cf]/20 text-[#8127cf]
                       rounded-full font-bold text-sm
                       flex items-center justify-center gap-2
                       hover:bg-[#8127cf]/5 active:scale-[0.98] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            Revoir mes réponses
          </button>
        </div>

      </div>

      {/* ARIA FAB */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full text-white
                   shadow-lg flex items-center justify-center
                   hover:scale-110 active:scale-95 transition-all z-50 group"
        style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
      >
        <span className="material-symbols-outlined text-[28px]">auto_awesome</span>
        <span className="absolute right-16 bg-[#0b1c30] text-white px-3 py-1
                         rounded-md text-xs opacity-0 group-hover:opacity-100
                         transition-opacity whitespace-nowrap">
          Aide IA contextuelle
        </span>
      </button>

    </div>
  )
}