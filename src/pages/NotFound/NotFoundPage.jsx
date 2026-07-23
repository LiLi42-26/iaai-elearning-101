// src/pages/NotFound/NotFoundPage.jsx
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import ARIAFloatingAssistant from '@/components/ui/ARIAFloatingAssistant'
import Logo from '@/components/ui/Logo'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex items-center justify-center p-6">
      <Link to={ROUTES.HOME} className="fixed top-6 left-6 z-20 hover:opacity-80 transition-opacity">
        <Logo size="sm" />
      </Link>

      <div className="text-center max-w-md">

        {/* Code erreur */}
        <p
          className="text-8xl font-bold font-display mb-6"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          404
        </p>

        {/* Illustration */}
        <div
          className="relative mx-auto mb-8 w-56 h-56 rounded-3xl overflow-hidden shadow-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(160deg, #2a2438 0%, #17132a 100%)' }}
        >
          <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#8127cf]/30 blur-2xl" />
          <div className="absolute -bottom-6 -left-6 w-28 h-28 rounded-full bg-[#ec4899]/20 blur-2xl" />
          <div className="relative flex flex-col items-center gap-3">
            <div className="w-20 h-20 rounded-2xl bg-white/95 flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-[42px] text-[#8127cf]">smart_toy</span>
            </div>
            <div className="w-24 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        <h1 className="text-2xl font-bold font-display text-[#0b1c30] mb-3">
          Oups ! Page introuvable
        </h1>
        <p className="text-[#7e7385] mb-8 leading-relaxed">
          La page que vous cherchez n'existe pas ou a été déplacée par nos algorithmes.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-bold text-sm hover:shadow-lg hover:shadow-[#8127cf]/20 active:scale-[0.98] transition-all"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Retour au Dashboard
          </Link>
          <Link
            to={ROUTES.HOME}
            className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-[#8127cf]/20 text-[#8127cf] font-bold text-sm hover:bg-[#8127cf]/5 transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>

        {/* Signaler un problème */}
        <button
          onClick={() => navigate(ROUTES.COMMUNITY)}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-[#a89fb5] hover:text-[#8127cf] transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">info</span>
          Signaler un problème
        </button>
      </div>

      <ARIAFloatingAssistant />
    </div>
  )
}
