import { Link, Outlet } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import logo from '@/assets/logo-iaai.png'


function PublicLayout() {
  return (
    <div className="min-h-screen bg-gradient-iaai">
      <header className="fixed top-0 z-50 w-full border-b border-violet-100/70 bg-white/80 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to={ROUTES.HOME}>
          <img src={logo} alt="IAAI eLearning 101" className="h-14 object-contain" />
          </Link>
          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            <a className="text-violet-800" href="#cursus">
              Cursus
            </a>
            <a className="transition hover:text-violet-800" href="#features">
              Fonctionnalités
            </a>
            <a className="transition hover:text-violet-800" href="#pricing">
              Tarifs
            </a>
            <a className="transition hover:text-violet-800" href="#faq">
              FAQ
            </a>
          </div>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN} className="hidden text-sm font-semibold text-violet-800 sm:inline-flex">
              Connexion
            </Link>
            <Link to={ROUTES.REGISTER} className="btn-primary">
              Commencer gratuitement
            </Link>
          </div>
        </nav>
      </header>
      <main className="pt-20">
        <Outlet />
      </main>
    </div>
  )
}

export default PublicLayout
