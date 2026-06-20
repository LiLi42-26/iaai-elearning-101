import { useEffect } from 'react'
import AppRouter from '@/router/AppRouter'
import { supabase } from '@/services/supabaseClient'
import { useAuthStore } from '@/store/authStore'

function App() {
  const { setUser, logout, setLoading } = useAuthStore()

  useEffect(() => {
    // Vérifier la session au démarrage
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(
          {
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || '',
            role: session.user.user_metadata?.role || 'LEARNER',
            isOnboardingComplete: true,
          },
          session.access_token
        )
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements de session (login, logout, refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser(
            {
              id: session.user.id,
              email: session.user.email,
              fullName: session.user.user_metadata?.full_name || '',
              role: session.user.user_metadata?.role || 'LEARNER',
              isOnboardingComplete: true,
            },
            session.access_token
          )
        } else {
          logout()
        }
      }
    )

    // Nettoyer l'écouteur quand le composant se démonte
    return () => subscription.unsubscribe()
  }, [setUser, logout, setLoading])

  return <AppRouter />
}

export default App