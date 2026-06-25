// src/layouts/AppLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/authService'
import { ROUTES } from '@/constants/routes'
import logo from '@/assets/logo-iaai.png'
import ARIAFloatingAssistant from '@/components/ui/ARIAFloatingAssistant'

const navItems = [
  { label: 'Tableau de bord', to: ROUTES.DASHBOARD,    icon: 'dashboard' },
  { label: 'Mon Parcours IA', to: ROUTES.CURRICULUM,   icon: 'school' },
  { label: 'Mes Certificats', to: ROUTES.CERTIFICATES, icon: 'workspace_premium' },
  { label: 'Communauté',      to: ROUTES.COMMUNITY,    icon: 'groups' },
  { label: 'Paramètres',      to: ROUTES.SETTINGS,     icon: 'settings' },
]

export default function AppLayout() {
  const { user, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()

  const [searchInput, setSearchInput] = useState('')

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U'

  // Plan affiché en sidebar — lu depuis le store (lui-même lu depuis Supabase)
  const planLabel = user?.plan === 'premium' ? 'Plan Premium ✨' : 'Plan Gratuit'
  const isPremium = user?.plan === 'premium'

  const handleLogout = async () => {
    await logout()
    logoutStore()
    navigate(ROUTES.LOGIN)
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchInput.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  const handleSearchClick = () => {
    if (searchInput.trim()) {
      navigate(`${ROUTES.SEARCH}?q=${encodeURIComponent(searchInput.trim())}`)
    } else {
      navigate(ROUTES.SEARCH)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-[#cfc2d6]
                        flex flex-col py-2 z-50 hidden lg:flex">

        {/* Logo */}
        <div className="px-6 py-4 mb-6">
          <img src={logo} alt="IAAI eLearning 101" className="h-12 w-auto object-contain" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#f0dbff] text-[#8127cf] font-bold border-r-4 border-[#8127cf]'
                    : 'text-[#4d4354] hover:bg-[#f0dbff]/50 hover:text-[#8127cf]'
                }`
              }
            >
              <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User card */}
        <div className="px-4 mt-auto mb-2">
          <div className="bg-[#f0dbff]/30 rounded-xl p-4 mb-2 border border-[#8127cf]/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[#f0dbff] flex items-center
                              justify-center text-[#8127cf] font-bold text-sm">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#0b1c30] truncate">
                  {user?.fullName || 'Utilisateur'}
                </p>
                <p className={`text-xs font-medium ${isPremium ? 'text-[#8127cf]' : 'text-[#7e7385]'}`}>
                  {planLabel}
                </p>
              </div>
            </div>

            {/* Bouton upgrade — masqué si déjà premium */}
            {!isPremium && (
              <button
                onClick={() => navigate(ROUTES.UPGRADE)}
                className="w-full py-2.5 rounded-full text-white text-xs font-bold
                           flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
              >
                Passer à Illimité
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>

          <NavLink
            to={ROUTES.PROFILE}
            className="flex items-center gap-3 px-2 py-2.5 text-[#4d4354]
                       hover:text-[#8127cf] transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[22px]">account_circle</span>
            Mon Profil
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-2 py-2.5 text-[#4d4354]
                       hover:text-red-500 transition-colors text-sm w-full"
          >
            <span className="material-symbols-outlined text-[22px]">logout</span>
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Contenu principal ────────────────────────────────────────────────── */}
      <div className="lg:ml-64 flex-1 flex flex-col">

        {/* Navbar */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-[#f8f5ff]/80
                           backdrop-blur-md flex items-center justify-between
                           px-8 z-40 border-b border-[#f0f0f5]">

          {/* Barre de recherche connectée */}
          <div
            className="flex items-center bg-white px-4 py-2 rounded-full
                        w-80 border border-[#cfc2d6]/30 gap-2 cursor-text
                        focus-within:border-[#8127cf]/40 transition-colors"
          >
            <button
              onClick={handleSearchClick}
              className="flex-shrink-0 text-[#7e7385] hover:text-[#8127cf] transition-colors"
              aria-label="Rechercher"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Rechercher un cours…"
              className="bg-transparent border-none focus:outline-none text-sm
                         text-[#0b1c30] placeholder:text-[#7e7385] w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/notifications')}
              className="w-10 h-10 rounded-full flex items-center justify-center
                         hover:bg-white transition-colors"
            >
              <span className="material-symbols-outlined text-[#4d4354]">notifications</span>
            </button>
            <div
              onClick={() => navigate(ROUTES.PROFILE)}
              className="w-10 h-10 rounded-full bg-[#f0dbff] flex items-center
                          justify-center text-[#8127cf] font-bold text-sm
                          border border-[#8127cf]/20 cursor-pointer hover:ring-2
                          hover:ring-[#8127cf]/30 transition-all"
            >
              {initials}
            </div>
          </div>
        </header>

        <main className="mt-16 p-8 flex-1">
          <Outlet />
        </main>
      </div>

      {/* ARIA Assistant flottant */}
      <ARIAFloatingAssistant />

    </div>
  )
}