// src/pages/Auth/ForgotPasswordPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { forgotPassword } from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import logo from '@/assets/logo-iaai.png'

export default function ForgotPasswordPage() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      setError(t('auth.forgot.error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] font-sans antialiased">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-10 py-4">
        <Link to={ROUTES.HOME}>
          <img src={logo} alt="IAAI eLearning 101" className="h-14 object-contain" />
        </Link>
      </header>

      {/* Main */}
      <main className="min-h-screen flex items-center justify-center pt-20 pb-12 px-6">
        <section className="w-full max-w-md bg-white rounded-2xl border border-violet-100 p-8 shadow-sm">

          {/* Icône */}
          <div className="w-16 h-16 rounded-2xl bg-violet-100 flex items-center justify-center mb-6 mx-auto">
            <span className="material-symbols-outlined text-violet-700 text-[32px]">
              lock_reset
            </span>
          </div>

          {!sent ? (
            <>
              {/* Titre */}
              <h1 className="text-2xl font-bold text-[#0b1c30] font-display text-center">
                {t('auth.forgot.title')}
              </h1>
              <p className="mt-2 text-sm text-[#7e7385] text-center">
                {t('auth.forgot.subtitle')}
              </p>

              {/* Erreur */}
              {error && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Formulaire */}
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4d4354]">
                    {t('auth.forgot.email')}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(null) }}
                    placeholder="amina@exemple.ma"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-[#f0f0f5] bg-white
                               text-[#0b1c30] text-base focus:border-[#6d28d9]
                               focus:ring-4 focus:ring-[#6d28d9]/10 focus:outline-none transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-full text-white text-sm font-semibold
                             flex items-center justify-center gap-2
                             transition-all duration-300 active:scale-[0.98]
                             disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
                >
                  {isLoading ? (
                    <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  ) : (
                    t('auth.forgot.submit')
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Succès */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-green-600 text-[32px]">
                  mark_email_read
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#0b1c30] font-display">
                {t('auth.forgot.success_title')}
              </h2>
              <p className="text-sm text-[#7e7385]">
                {t('auth.forgot.success_desc')}
              </p>
              <p className="text-sm font-semibold text-violet-700">{email}</p>
            </div>
          )}

          {/* Retour connexion */}
          <div className="mt-6 text-center">
            <Link
              to={ROUTES.LOGIN}
              className="inline-flex items-center gap-1 text-sm text-violet-700 font-semibold hover:underline"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              {t('auth.forgot.back_to_login')}
            </Link>
          </div>

        </section>
      </main>

    </div>
  )
}