// src/hooks/useAuth.js
import { useAuthStore } from '@/store/authStore'

/**
 * useAuth — accès simplifié au store d'authentification.
 *
 * Usage :
 *   const { user, isAuthenticated, isLoading, isAdmin } = useAuth()
 */
export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, logout, updateUser } = useAuthStore()

  const isAdmin = user?.role === 'ADMIN'
  const firstName = user?.fullName?.split(' ')[0] || ''
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  return {
    user,
    isAuthenticated,
    isLoading,
    isAdmin,
    firstName,
    initials,
    setUser,
    logout,
    updateUser,
  }
}