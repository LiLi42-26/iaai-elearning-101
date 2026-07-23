import { Link, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import logo from '@/assets/logo-iaai.png'
import ThemeToggle from '@/components/ui/ThemeToggle'

function PublicLayout() {
  return (
    <div className="min-h-screen theme-transition" style={{ background: 'var(--color-bg)' }}>

      {/* ── Topbar ── */}
      <header
        className="fixed top-0 z-50 w-full border-b backdrop-blur-xl shadow-sm theme-transition"
        style={{
          background: 'var(--color-bg-header)',
          borderColor: 'var(--color-border)',
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <Link to={ROUTES.HOME}>
            <img src={logo} alt="IAAI eLearning 101" className="h-14 object-contain" />
          </Link>

          {/* Liens de navigation */}
          <div className="hidden items-center gap-8 text-sm font-semibold md:flex"
               style={{ color: 'var(--color-text-muted)' }}>
            <a className="transition-colors duration-150 hover:opacity-70" href="#comment-ca-marche">
              Comment ça marche
            </a>
            <a className="transition-colors duration-150 hover:opacity-70" href="#cursus">
              Cours
            </a>
            <a className="transition-colors duration-150 hover:opacity-70" href="#pricing">
              Tarifs
            </a>
            <a className="transition-colors duration-150 hover:opacity-70" href="#temoignages">
              Témoignages
            </a>
            <a className="transition-colors duration-150 hover:opacity-70" href="#faq">
              FAQ
            </a>
          </div>

          {/* CTA + ThemeToggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon" />
            <Link
              to={ROUTES.LOGIN}
              className="hidden text-sm font-semibold sm:inline-flex transition-colors duration-150"
              style={{ color: 'var(--color-primary)' }}
            >
              Connexion
            </Link>
            <Link to={ROUTES.REGISTER} className="btn-primary">
              Commencer gratuitement
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Contenu ── */}
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout
