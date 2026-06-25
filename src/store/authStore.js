// src/store/authStore.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '@/services/supabaseClient'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      // accessToken retiré de l'état — Supabase gère ses propres tokens
      // via cookies/localStorage internes. Lire depuis supabase.auth.getSession()
      // si besoin ponctuel du token.
      isAuthenticated: false,
      isLoading: true,

      setUser: async (user) => {
        // Récupérer le plan et le rôle depuis la table profiles
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan, role, full_name')
            .eq('id', user.id)
            .single()

          const enrichedUser = {
            ...user,
            plan: profile?.plan ?? 'free',
            role: profile?.role ?? 'LEARNER',
            fullName: profile?.full_name || user.fullName || user.email,
          }

          set({
            user: enrichedUser,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch {
          // Si la table profiles n'est pas accessible, on garde l'user tel quel
          set({
            user: { ...user, plan: 'free' },
            isAuthenticated: true,
            isLoading: false,
          })
        }
      },

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      // Rafraîchir le plan depuis Supabase
      refreshProfile: async () => {
        const { user } = get()
        if (!user?.id) return
        try {
          const { data: profile } = await supabase
            .from('profiles')
            .select('plan, role, full_name')
            .eq('id', user.id)
            .single()

          if (profile) {
            set((state) => ({
              user: {
                ...state.user,
                plan: profile.plan,
                role: profile.role,
                fullName: profile.full_name || state.user.fullName,
              },
            }))
          }
        } catch (err) {
          console.warn('refreshProfile error:', err)
        }
      },
    }),
    {
      name: 'iaai-auth',
      partialize: (state) => ({
        user: state.user,
        // accessToken délibérément absent — ne jamais persister un JWT en localStorage
        isAuthenticated: state.isAuthenticated,
        // isLoading exclu : doit toujours démarrer à true après rehydration
        // pour forcer la vérification de session dans App.jsx
      }),
      onRehydrateStorage: () => (state) => {
        // Après rehydration depuis localStorage, forcer isLoading = true
        // pour que App.jsx vérifie toujours la session Supabase avant d'afficher
        // une page protégée. Sans ça, un isLoading:false persisté en cache
        // pourrait court-circuiter le check de session.
        if (state) {
          state.isLoading = true
        }
      },
    }
  )
)