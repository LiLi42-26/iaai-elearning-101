// src/pages/Auth/ResetPasswordPage.jsx
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { supabase } from '@/services/supabaseClient'
import { ROUTES } from '@/constants/routes'
import logo from '@/assets/logo-iaai.png'
import { validatePassword, checkPasswordRules } from '@/utils/passwordPolicy'
import PasswordRulesChecklist from '@/components/ui/PasswordRulesChecklist'

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Supabase envoie le token via l'URL en fragment (#access_token=...)
  // onAuthStateChange le capte automatiquement lors du chargement
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // L'utilisateur est authentifié via le lien de réinitialisation
        // On peut maintenant lui permettre de définir un nouveau mot de passe
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (form.password !== form.confirmPassword) {
      setError(t('auth.reset.error_passwords'))
      return
    }

    const { valid, errors } = validatePassword(form.password)
    if (!valid) {
      setError(t(errors[0]))
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: form.password,
      })
      if (error) throw error

      setSuccess(true)
      // Rediriger vers login après 2 secondes
      setTimeout(() => navigate(ROUTES.LOGIN), 2500)
    } catch {
      setError(t('auth.reset.error_generic'))
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
              {success ? 'check_circle' : 'key'}
            </span>
          </div>

          {!success ? (
            <>
              {/* Titre */}
              <h1 className="text-2xl font-bold text-[#0b1c30] font-display text-center">
                {t('auth.reset.title')}
              </h1>
              <p className="mt-2 text-sm text-[#7e7385] text-center">
                {t('auth.reset.subtitle')}
              </p>

              {/* Erreur */}
              {error && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                  {error}
                </div>
              )}

              {/* Formulaire */}
              <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

                {/* Nouveau mot de passe */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4d4354]">
                    {t('auth.reset.new_password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-[#f0f0f5] bg-white
                                 text-[#0b1c30] text-base focus:border-[#6d28d9]
                                 focus:ring-4 focus:ring-[#6d28d9]/10 focus:outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7e7385] hover:text-[#6d28d9] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                  <PasswordRulesChecklist checks={checkPasswordRules(form.password)} />
                </div>

                {/* Confirmer */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#4d4354]">
                    {t('auth.reset.confirm_password')}
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-5 py-4 rounded-xl border border-[#f0f0f5] bg-white
                                 text-[#0b1c30] text-base focus:border-[#6d28d9]
                                 focus:ring-4 focus:ring-[#6d28d9]/10 focus:outline-none transition-all pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7e7385] hover:text-[#6d28d9] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showConfirm ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Bouton */}
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
                    t('auth.reset.submit')
                  )}
                </button>

              </form>
            </>
          ) : (
            /* Succès */
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold text-green-700 font-display">
                {t('auth.reset.success')}
              </h2>
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-violet-600 border-t-transparent mx-auto" />
            </div>
          )}

        </section>
      </main>

    </div>
  )
}