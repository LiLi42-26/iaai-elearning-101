// src/pages/NotFound/NotFoundPage.jsx
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex items-center justify-center p-6">
      <div className="text-center max-w-md">

        {/* Illustration SVG */}
        <div className="relative mx-auto mb-8 w-48 h-48">
          <div className="absolute inset-0 rounded-full opacity-20 animate-pulse"
               style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }} />
          <div className="absolute inset-4 rounded-full flex items-center justify-center"
               style={{ background: 'linear-gradient(135deg, #f0dbff 0%, #e5eeff 100%)' }}>
            <span className="material-symbols-outlined text-[80px] text-[#8127cf]">travel_explore</span>
          </div>
        </div>

        {/* Code erreur */}
        <p className="text-8xl font-bold font-display mb-2"
           style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </p>

        <h1 className="text-2xl font-bold font-display text-[#0b1c30] mb-3">
          Page introuvable
        </h1>
        <p className="text-[#68627a] mb-8 leading-relaxed">
          Cette page n'existe pas ou a été déplacée. Pas d'inquiétude, ARIA peut vous aider à retrouver votre chemin !
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#8127cf]/20 hover:scale-105 active:scale-95 transition-all"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
            Tableau de bord
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-[#ded6f3] text-[#8127cf] font-semibold text-sm hover:bg-[#f0dbff] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Page précédente
          </button>
        </div>

        {/* Liens rapides */}
        <div className="mt-10 border-t border-[#ded6f3] pt-8">
          <p className="text-sm text-[#68627a] mb-4">Où voulez-vous aller ?</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              { label: 'Mon Parcours IA', to: ROUTES.CURRICULUM,   icon: 'school' },
              { label: 'Communauté',      to: ROUTES.COMMUNITY,    icon: 'groups' },
              { label: 'Mes certificats', to: ROUTES.CERTIFICATES, icon: 'workspace_premium' },
            ].map(l => (
              <Link key={l.to} to={l.to} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#ded6f3] text-sm text-[#4d4354] hover:text-[#8127cf] hover:border-[#8127cf]/40 hover:bg-[#f0dbff]/50 transition-all">
                <span className="material-symbols-outlined text-[16px]">{l.icon}</span>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
