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
        // On ne passe plus session.access_token — le store ne le stocke plus.
        // Le rôle initial vient de user_metadata mais sera immédiatement
        // écrasé par profiles.role dans setUser() → source de vérité unique.
        setUser({
          id: session.user.id,
          email: session.user.email,
          fullName: session.user.user_metadata?.full_name || '',
          isOnboardingComplete: true,
        })
      } else {
        setLoading(false)
      }
    })

    // Écouter les changements de session (login, logout, refresh token)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session) {
          setUser({
            id: session.user.id,
            email: session.user.email,
            fullName: session.user.user_metadata?.full_name || '',
            isOnboardingComplete: true,
          })
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