// src/layouts/AdminLayout.jsx
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { logout } from '@/services/authService'
import { ROUTES } from '@/constants/routes'

const navItems = [
  { label: "Vue d'ensemble", to: ROUTES.ADMIN, icon: 'dashboard', end: true },
  { label: 'Utilisateurs',   to: ROUTES.ADMIN_USERS, icon: 'group', end: false },
  { label: 'Cours',          to: ROUTES.ADMIN_COURSES, icon: 'menu_book', end: false },
  { label: 'Statistiques',   to: ROUTES.ADMIN_ANALYTICS || '/admin/analytics', icon: 'bar_chart', end: false },
  { label: 'Paramètres',     to: '/admin/settings', icon: 'settings', end: false },
]

export default function AdminLayout() {
  const { user, logout: logoutStore } = useAuthStore()
  const navigate = useNavigate()

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'AD'

  const handleLogout = async () => {
    await logout()
    logoutStore()
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="min-h-screen bg-[#f7f5ff] flex">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="fixed left-0 top-0 h-full w-[230px] bg-white border-r border-gray-100 flex flex-col z-50 shadow-sm">

        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[18px]">psychology</span>
            </div>
            <span className="font-display font-bold text-[#0b1c30] text-lg tracking-tight">IAAI 101</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-purple-100 text-purple-700 font-semibold shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 space-y-1 border-t border-gray-100 pt-3">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span>
            Download Reports
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">help_outline</span>
            Help Center
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            Déconnexion
          </button>

          {/* User card */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 mt-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#0b1c30] truncate">{user?.fullName || 'Admin Sara'}</p>
              <p className="text-xs text-purple-500 font-semibold tracking-wide">SUPER ADMIN</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────────────────────── */}
      <div className="ml-[230px] flex-1 flex flex-col min-h-screen">

        {/* Top header */}
        <header className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 h-14 flex items-center justify-between px-8 z-40">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 w-80 transition-all focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100">
            <span className="material-symbols-outlined text-gray-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Rechercher un utilisateur, un cours..."
              className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-gray-500 text-[20px]">notifications</span>
            </button>
            <button className="w-9 h-9 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-gray-500 text-[20px]">help_outline</span>
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-gray-100 ml-1">
              <div className="text-right">
                <p className="text-xs font-semibold text-[#0b1c30] leading-tight">{user?.fullName || 'Admin User'}</p>
                <p className="text-[11px] text-gray-400 leading-tight">Administrator</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                {initials}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
