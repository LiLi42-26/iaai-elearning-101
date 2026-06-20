import { Link, useLocation } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

const steps = [
  {
    path: ROUTES.ONBOARDING_1,
    eyebrow: 'Étape 1 sur 3',
    title: 'Bienvenue sur IAAI eLearning 101 !',
    text: "La plateforme marocaine pour apprendre l'IA de zéro.",
    chips: ['7 modules', '38 leçons', 'Certifié'],
    button: 'Commencer',
    next: ROUTES.ONBOARDING_2,
  },
  {
    path: ROUTES.ONBOARDING_2,
    eyebrow: 'Étape 2 sur 3',
    title: 'Quel est votre niveau actuel ?',
    text: 'Nous adapterons le parcours recommandé selon votre point de départ.',
    chips: ['Débutant', 'Quelques bases', 'À l’aise'],
    button: 'Continuer',
    next: ROUTES.ONBOARDING_3,
  },
  {
    path: ROUTES.ONBOARDING_3,
    eyebrow: 'Étape 3 sur 3',
    title: 'Quel est votre objectif principal ?',
    text: 'Choisissez ce qui vous motive pour apprendre avec plus de clarté.',
    chips: ['Carrière', 'Études', 'Culture IA'],
    button: 'Aller au dashboard',
    next: ROUTES.DASHBOARD,
  },
]

function OnboardingPage() {
  const { pathname } = useLocation()
  const currentIndex = Math.max(
    steps.findIndex((step) => step.path === pathname),
    0,
  )
  const currentStep = steps[currentIndex]

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-iaai px-4 py-12">
      <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-violet-300/40 blur-3xl" />
      <div className="absolute -right-10 bottom-20 h-80 w-80 rounded-full bg-cyan-200/50 blur-3xl" />

      <section className="relative z-10 flex min-h-[calc(100vh-96px)] w-full max-w-[600px] flex-col items-center justify-between text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {steps.map((step, index) => (
              <span
                key={step.path}
                className={`rounded-full transition-all ${
                  index === currentIndex ? 'h-3 w-3 bg-violet-700 ring-4 ring-violet-200' : 'h-2.5 w-2.5 bg-violet-200'
                }`}
              />
            ))}
          </div>
          <p className="text-sm font-semibold text-[var(--color-text-muted)]">{currentStep.eyebrow}</p>
        </div>

        <div className="flex flex-col items-center gap-8">
          <div className="relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-violet-200/70 to-cyan-100/80 blur-2xl" />
            <div className="relative flex h-44 w-44 items-center justify-center rounded-[2rem] bg-white/70 shadow-2xl backdrop-blur md:h-56 md:w-56">
              <div className="absolute h-32 w-32 rounded-full border border-violet-300" />
              <div className="absolute h-20 w-44 rotate-45 rounded-full border border-cyan-300" />
              <div className="h-5 w-5 rounded-full bg-violet-700 shadow-[0_0_42px_rgba(109,40,217,0.7)]" />
            </div>
            <span className="absolute right-10 top-10 h-4 w-4 rounded-full bg-cyan-500" />
            <span className="absolute bottom-10 left-5 h-3 w-3 rounded-full bg-violet-700" />
            <span className="absolute left-0 top-1/2 h-2 w-2 rounded-full bg-fuchsia-400" />
          </div>

          <div className="max-w-md space-y-4">
            <h1 className="text-3xl font-extrabold tracking-tight text-violet-950 md:text-4xl">
              {currentStep.title.includes('IAAI') ? (
                <>
                  Bienvenue sur <span className="text-gradient">IAAI eLearning 101</span> !
                </>
              ) : (
                currentStep.title
              )}
            </h1>
            <p className="text-[var(--color-text-muted)]">{currentStep.text}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {currentStep.chips.map((chip, index) => (
              <button
                key={chip}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition hover:-translate-y-0.5 ${
                  index === 0
                    ? 'border-violet-200 bg-violet-100 text-violet-800'
                    : index === 1
                      ? 'border-fuchsia-200 bg-fuchsia-100 text-fuchsia-800'
                      : 'border-cyan-200 bg-cyan-100 text-cyan-800'
                }`}
                type="button"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-5">
          <Link
            className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-700 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-violet-200 transition hover:opacity-95 active:scale-[0.98] md:w-auto md:min-w-[280px]"
            to={currentStep.next}
          >
            {currentStep.button}
          </Link>
          <Link className="px-4 py-2 text-sm font-semibold text-[var(--color-text-muted)] hover:text-violet-800" to={ROUTES.DASHBOARD}>
            Passer l&apos;introduction
          </Link>
        </div>
      </section>
    </main>
  )
}

export default OnboardingPage
