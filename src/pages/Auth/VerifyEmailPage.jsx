// src/pages/Auth/VerifyEmailPage.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/services/supabaseClient'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'

function VerifyEmailPage() {
  const navigate = useNavigate()
  const { setUser } = useAuthStore()
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [resent, setResent] = useState(false)

  // Récupère l'email depuis localStorage (sauvegardé au moment de l'inscription)
  const email = localStorage.getItem('iaai-pending-email') || ''

  const handleVerify = async (e) => {
    e.preventDefault()
    setError(null)

    if (otp.length !== 6) {
      setError('Le code doit contenir 6 chiffres.')
      return
    }

    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
      })

      if (error) throw error

      // Connecter l'utilisateur dans le store
      setUser(
        {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || '',
          role: data.user.user_metadata?.role || 'LEARNER',
          isOnboardingComplete: false,
        },
        data.session.access_token
      )

      // Nettoyer le localStorage
      localStorage.removeItem('iaai-pending-email')

      // Rediriger vers l'onboarding
      navigate(ROUTES.ONBOARDING_1)
    } catch {
      setError('Code invalide ou expiré. Vérifie ton email.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setError(null)
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })
      if (error) throw error
      setResent(true)
      setTimeout(() => setResent(false), 5000)
    } catch  {
      setError('Impossible de renvoyer le code.')
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex items-center justify-center px-6">
      <section className="w-full max-w-md bg-white rounded-2xl border border-violet-100 p-8 shadow-sm">

        {/* Icône */}
        <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-6 mx-auto">
          <span className="material-symbols-outlined text-violet-700 text-[32px]">
            mark_email_unread
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-bold text-[#0b1c30] font-display text-center">
          Vérifiez votre email
        </h1>
        <p className="mt-2 text-sm text-[#7e7385] text-center">
          Un code à 6 chiffres a été envoyé à
        </p>
        {email && (
          <p className="text-sm font-semibold text-violet-700 text-center mt-1">
            {email}
          </p>
        )}

        {/* Erreur */}
        {error && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Succès renvoi */}
        {resent && (
          <div className="mt-4 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm text-center">
            Code renvoyé avec succès ✅
          </div>
        )}

        {/* Formulaire OTP */}
        <form className="mt-6 space-y-4" onSubmit={handleVerify}>
          <input
            type="text"
            value={otp}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 6)
              setOtp(val)
              setError(null)
            }}
            placeholder="000000"
            maxLength={6}
            className="w-full px-5 py-4 rounded-xl border border-[#f0f0f5] bg-white
                       text-[#0b1c30] text-center text-2xl tracking-[0.5em] font-mono
                       focus:border-[#6d28d9] focus:ring-4 focus:ring-[#6d28d9]/10
                       focus:outline-none transition-all"
          />

          <button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full py-4 rounded-full text-white text-sm font-semibold
                       flex items-center justify-center gap-2
                       transition-all duration-300 active:scale-[0.98]
                       disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              'Vérifier mon compte'
            )}
          </button>
        </form>

        {/* Renvoyer le code */}
        <p className="mt-6 text-sm text-[#7e7385] text-center">
          Vous n'avez pas reçu le code ?{' '}
          <button
            onClick={handleResend}
            className="text-violet-700 font-semibold hover:underline"
          >
            Renvoyer
          </button>
        </p>

      </section>
    </div>
  )
}

export default VerifyEmailPage
