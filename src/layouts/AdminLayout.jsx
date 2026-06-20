import { Link, NavLink, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const adminItems = [
  { label: 'Vue admin', to: ROUTES.ADMIN },
  { label: 'Utilisateurs', to: ROUTES.ADMIN_USERS },
  { label: 'Cours', to: ROUTES.ADMIN_COURSES },
]

function AdminLayout() {
  return (
    <div className="min-h-screen bg-violet-950 text-white">
      <header className="border-b border-white/10 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link to={ROUTES.ADMIN} className="font-display text-lg font-bold">
            IAAI Admin
          </Link>
          <Link to={ROUTES.DASHBOARD} className="rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold">
            Retour app
          </Link>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[220px_1fr] lg:px-8">
        <nav className="space-y-2">
          {adminItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === ROUTES.ADMIN}
              className={({ isActive }) =>
                `block rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  isActive ? 'bg-white text-violet-950' : 'bg-white/5 text-violet-100 hover:bg-white/10'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <main className="rounded-2xl bg-white p-6 text-slate-950">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
