// src/pages/Auth/LoginPage.jsx
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { login } from '@/services/authService'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'
import logo from '@/assets/logo-iaai.png'
import AuthVisual from '@/components/ui/AuthVisual'

function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setUser } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  // Rediriger vers la page demandée avant login, sinon dashboard
  const from = location.state?.from?.pathname || ROUTES.DASHBOARD

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const data = await login({
        email: form.email,
        password: form.password,
      })

      setUser(
        {
          id: data.user.id,
          email: data.user.email,
          fullName: data.user.user_metadata?.full_name || '',
          role: data.user.user_metadata?.role || 'LEARNER',
          isOnboardingComplete: true,
        },
        data.session.access_token
      )

      navigate(from, { replace: true })
    } catch {
      setError('Email ou mot de passe incorrect.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] font-sans antialiased">

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center px-6 md:px-10 py-4">
        <img src={logo} alt="IAAI eLearning 101" className="h-14 object-contain" />
      </header>

      {/* Main */}
      <main className="min-h-screen flex items-center justify-center pt-20 pb-12">
        <div className="w-full max-w-[1200px] px-6 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Formulaire */}
          <section className="flex flex-col space-y-8">

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold text-[#0b1c30] tracking-tight font-display">
                Bon retour parmi nous
              </h1>
              <p className="text-lg text-[#7e7385]">
                Connectez-vous pour continuer votre parcours IA
              </p>
            </div>

            {/* Erreur */}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#4d4354]">
                  Votre email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="amina@exemple.ma"
                  required
                  className="w-full px-5 py-4 rounded-xl border border-[#f0f0f5] bg-white text-[#0b1c30] text-base
                             focus:border-[#6d28d9] focus:ring-4 focus:ring-[#6d28d9]/10 focus:outline-none transition-all"
                />
              </div>

              {/* Mot de passe */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-[#4d4354]">
                    Mot de passe
                  </label>
                  <Link
                    to={ROUTES.FORGOT_PASSWORD}
                    className="text-sm text-violet-700 hover:underline"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className="w-full px-5 py-4 rounded-xl border border-[#f0f0f5] bg-white text-[#0b1c30] text-base
                               focus:border-[#6d28d9] focus:ring-4 focus:ring-[#6d28d9]/10 focus:outline-none transition-all pr-12"
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
              </div>

              {/* Bouton submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 rounded-full text-white text-sm font-semibold mt-4
                           flex items-center justify-center gap-2
                           transition-all duration-300 active:scale-[0.98]
                           disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
              >
                {isLoading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    Se connecter
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

            </form>

            <p className="text-base text-[#4d4354] text-center lg:text-left">
              Pas encore de compte ?{' '}
              <Link to={ROUTES.REGISTER} className="text-[#6d28d9] font-bold hover:underline">
                Créer un compte gratuit
              </Link>
            </p>

          </section>

          {/* Illustration */}
          <AuthVisual
            topBadge={{ icon: 'school', label: 'IAAI eLearning' }}
          />

        </div>
      </main>

    </div>
  )
}

export default LoginPage