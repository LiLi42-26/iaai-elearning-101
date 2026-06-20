import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

function NotFoundPage() {
  return (
    <section className="page-container text-center">
      <h1 className="text-4xl text-violet-950">Page introuvable</h1>
      <p className="mt-4 text-[var(--color-text-muted)]">Cette page n&apos;existe pas encore.</p>
      <Link to={ROUTES.HOME} className="btn-primary mt-6">
        Retour accueil
      </Link>
    </section>
  )
}

export default NotFoundPage
