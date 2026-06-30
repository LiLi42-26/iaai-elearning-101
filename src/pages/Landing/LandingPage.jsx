// src/pages/Landing/LandingPage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import Logo from '@/components/ui/Logo'
import module1Image from '@/assets/modules/module1-fondations.png'
import module2Image from '@/assets/modules/module2-deeplearning.png'

const stats = [
  { value: '2 400+', label: 'Apprenants' },
  { value: '4.9/5', label: 'Note moyenne' },
  { value: '64h', label: 'De contenu' },
  { value: '92%', label: 'Complétion' },
]

const audiences = [
  {
    title: 'Étudiant',
    icon: 'school',
    accent: 'bg-violet-100 text-violet-700',
    text: "Vous préparez votre avenir dans la tech et voulez comprendre l'IA avant tout le monde.",
  },
  {
    title: 'Professionnel',
    icon: 'work',
    accent: 'bg-cyan-100 text-cyan-700',
    text: "Vous voulez intégrer l'IA dans votre métier sans avoir de background technique.",
  },
  {
    title: 'Curieux',
    icon: 'psychology',
    accent: 'bg-fuchsia-100 text-fuchsia-700',
    text: "Vous entendez parler d'IA partout et vous voulez enfin comprendre de quoi il s'agit.",
  },
]

const features = [
  {
    icon: 'visibility',
    title: 'Moteur Visual-First',
    accent: 'bg-violet-100 text-violet-700',
    text: "Visualisez les concepts de l'IA sous forme d'animations interactives. Chaque notion abstraite devient une image claire.",
  },
  {
    icon: 'hub',
    title: 'Graphe de Connexions',
    accent: 'bg-cyan-100 text-cyan-700',
    text: "Chaque concept mène naturellement au suivant. L'apprenant comprend l'ordre du parcours sans se perdre.",
  },
  {
    icon: 'bolt',
    title: 'Apprentissage Accéléré',
    accent: 'bg-fuchsia-100 text-fuchsia-700',
    text: 'Des leçons courtes, visuelles et progressives pour retenir les idées clés sans surcharge.',
  },
  {
    icon: 'school',
    title: 'Certifications Reconnues',
    accent: 'bg-blue-100 text-blue-700',
    text: "Un certificat final téléchargeable pour valoriser les acquis de l'apprenant.",
  },
  {
    icon: 'trending_up',
    title: 'Progression Claire',
    accent: 'bg-emerald-100 text-emerald-700',
    text: 'Dashboard, modules terminés, quiz et prochain module recommandé au même endroit.',
  },
  {
    icon: 'smartphone',
    title: '100% Mobile Ready',
    accent: 'bg-amber-100 text-amber-700',
    text: 'Une interface adaptée aux usages réels des apprenants au Maroc et en Afrique.',
  },
]

const courses = [
  {
    level: 'Débutant',
    meta: '12 leçons · 8h',
    title: "Module 1 — Qu'est-ce que l'IA ?",
    text: "Les bases pour comprendre l'IA sans avoir besoin de coder.",
    image: module1Image,
    accent: 'border-violet-200',
    badge: 'bg-violet-100 text-violet-800',
  },
  {
    level: 'Intermédiaire',
    meta: '18 leçons · 14h',
    title: 'Module 2 — Deep Learning',
    text: 'Découvrez comment les machines apprennent, avec des exemples concrets et visuels.',
    image: module2Image,
    accent: 'border-fuchsia-200',
    badge: 'bg-fuchsia-100 text-fuchsia-800',
  },
]

const steps = [
  {
    number: '1',
    title: 'Créez votre compte',
    text: 'Inscription rapide, puis vérification email pour sécuriser le compte.',
    color: 'bg-violet-700',
  },
  {
    number: '2',
    title: 'Apprentissage visuel',
    text: 'Regardez les vidéos, suivez les ressources et validez chaque étape par quiz.',
    color: 'bg-fuchsia-600',
  },
  {
    number: '3',
    title: 'Certification',
    text: 'Terminez le parcours et téléchargez votre certificat IAAI eLearning 101.',
    color: 'bg-cyan-600',
  },
]

const testimonials = [
  {
    quote: "La visualisation des concepts m'a permis de comprendre en quelques heures ce que je n'avais pas saisi en cours classiques.",
    name: 'Yasmine B.',
    role: 'Casablanca, Data Analyst',
  },
  {
    quote: "Enfin une plateforme moderne adaptée aux besoins du marché marocain. Les modules sont clairs et motivants.",
    name: 'Karim M.',
    role: 'Rabat, Software Engineer',
  },
  {
    quote: "L'interface est fluide, les explications sont simples, et on sent que le parcours est pensé pour les débutants.",
    name: 'Sofia R.',
    role: 'Marrakech, Étudiante',
  },
]

const plans = [
  {
    name: 'Essai',
    price: 'Gratuit',
    cta: "S'inscrire",
    highlighted: false,
    items: ['Module 00 complet', 'Dashboard personnel', 'Découverte du parcours'],
  },
  {
    name: 'Illimité',
    price: '149 MAD/mois',
    cta: 'Commencer maintenant',
    highlighted: true,
    items: ["Accès à tous les modules", 'Quiz et progression', 'Certificat téléchargeable', 'Ressources incluses'],
  },
  {
    name: 'Équipe',
    price: 'Sur mesure',
    cta: 'Contacter les ventes',
    highlighted: false,
    items: ["Licences d'équipe", 'Dashboard admin', 'Support prioritaire'],
  },
]

const faqs = [
  {
    question: 'Dois-je être bon en mathématiques pour commencer ?',
    answer: "Non. Le parcours commence par l'intuition visuelle avant les formules, pour rendre les concepts accessibles.",
  },
  {
    question: 'Quels sont les prérequis techniques ?',
    answer: "Une connexion internet et un navigateur moderne. Le MVP ne demande aucune installation complexe.",
  },
  {
    question: 'Les certificats sont-ils reconnus au Maroc ?',
    answer: "Le certificat sert d'abord à valoriser la complétion du parcours. Les partenariats pourront être ajoutés après le MVP.",
  },
  {
    question: "Y a-t-il un support pour les apprenants ?",
    answer: "Dans le MVP, le support reste minimal. La communauté et les notifications avancées sont prévues hors MVP.",
  },
]

// ── Composant FAQ accordéon ───────────────────────────────────────────────────
function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl border border-violet-100 bg-slate-50 overflow-hidden cursor-pointer"
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between p-6">
        <span className="text-lg font-bold text-violet-950 pr-4">{question}</span>
        <span
          className={`material-symbols-outlined text-[20px] text-[#7e7385] flex-shrink-0 transition-transform duration-200
                      ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </div>
      {open && (
        <div className="px-6 pb-6 -mt-2 text-[var(--color-text-muted)]">{answer}</div>
      )}
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="absolute -left-28 top-4 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />
        <div className="absolute -right-28 bottom-4 h-72 w-72 rounded-full bg-cyan-100/80 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          {/* Badge */}
          <p className="mx-auto mb-8 flex w-fit items-center gap-1.5 rounded-full bg-fuchsia-100 px-4 py-1.5 text-sm font-semibold text-fuchsia-800">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            IAAI eLearning 101 — Nouvelle génération
          </p>

          {/* Titre */}
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold text-violet-950 sm:text-6xl">
            Maîtrisez l&apos;IA par{' '}
            <span className="text-gradient">l&apos;Immersion Visuelle</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-text-muted)]">
            Oubliez les cours théoriques ennuyeux. Plongez dans un univers où les concepts deviennent des
            animations claires, progressives et mémorables.
          </p>

          {/* CTA */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#cursus"
              className="btn-primary px-8 py-4 flex items-center gap-2 group"
            >
              Découvrir le cursus
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </a>
            <Link className="btn-outline px-8 py-4" to={ROUTES.REGISTER}>
              Commencer gratuitement
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-6 rounded-2xl border border-violet-100 bg-white p-8 shadow-sm md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={stat.label} className={`text-center ${i > 0 ? 'border-l border-violet-100' : ''}`}>
                <div className="text-2xl font-extrabold text-fuchsia-700">{stat.value}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pour qui ? ───────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8" id="for-who">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-display font-bold text-violet-950">
            Cette formation est faite pour vous si...
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {audiences.map((audience) => (
              <article
                key={audience.title}
                className="rounded-xl border border-violet-100 bg-slate-50 p-8 text-left
                           hover:border-violet-300 hover:shadow-sm transition-all group"
              >
                <div className={`mb-6 flex h-14 w-14 items-center justify-center rounded-xl ${audience.accent}
                                 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-[26px]">{audience.icon}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-violet-950">{audience.title}</h3>
                <p className="mt-3 text-[var(--color-text-muted)]">{audience.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-display font-bold text-violet-950">
              Des fonctionnalités conçues pour le cerveau humain
            </h2>
            <p className="mt-4 text-[var(--color-text-muted)]">
              Les outils essentiels du MVP pour apprendre, pratiquer et prouver ses acquis.
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-xl border border-violet-100 bg-white p-8 transition hover:border-violet-300 hover:shadow-sm group"
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg ${feature.accent}
                                 group-hover:scale-110 transition-transform`}>
                  <span className="material-symbols-outlined text-[22px]">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-display font-bold text-violet-950">{feature.title}</h3>
                <p className="mt-3 text-[var(--color-text-muted)]">{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cours ────────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8" id="cursus">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-display font-bold text-violet-950">
            Un parcours sans friction
          </h2>
          <div className="mt-12 grid gap-10 md:grid-cols-2">
            {courses.map((course) => (
              <article
                key={course.title}
                className={`rounded-3xl border bg-slate-50 p-1 transition hover:shadow-2xl ${course.accent}`}
              >
                <div className="rounded-[1.35rem] bg-white p-8">
                  <div className="mb-6 flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${course.badge}`}>
                      {course.level}
                    </span>
                    <span className="text-sm font-semibold text-slate-500">{course.meta}</span>
                  </div>
                  <h3 className="text-3xl font-display font-bold text-violet-950">{course.title}</h3>
                  <p className="mt-4 text-[var(--color-text-muted)]">{course.text}</p>
                  <div className="mt-8 h-48 overflow-hidden rounded-2xl">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <Link to={ROUTES.REGISTER} className="btn-secondary mt-8 w-full text-center block">
                    {"S'inscrire au module"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────────────────── */}
      <section className="bg-gradient-iaai px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-display font-bold text-violet-950">Comment ça marche ?</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3 relative">
            {/* Ligne de connexion desktop */}
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-violet-200 -z-10" />
            {steps.map((step) => (
              <article key={step.number} className="flex flex-col items-center">
                <div
                  className={`mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg ${step.color}`}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-display font-bold text-violet-950">{step.title}</h3>
                <p className="mt-3 max-w-xs text-[var(--color-text-muted)]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ──────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-display font-bold text-violet-950">
            Ils apprennent avec nous
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-2xl border border-violet-100 bg-slate-50 p-8">
                <div className="mb-4 flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="italic leading-relaxed text-[var(--color-text-muted)]">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="mt-6 font-bold text-violet-950">{testimonial.name}</div>
                <div className="text-sm text-[var(--color-text-muted)]">{testimonial.role}</div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tarifs ───────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 px-4 py-24 sm:px-6 lg:px-8" id="pricing">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold text-violet-950">Investissez dans votre futur</h2>
            <p className="mt-4 text-[var(--color-text-muted)]">Des options simples pour commencer.</p>
          </div>
          <div className="mt-16 grid items-stretch gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-3xl bg-white p-8 transition
                  ${plan.highlighted
                    ? 'border-2 border-fuchsia-600 shadow-xl shadow-fuchsia-100 md:scale-105'
                    : 'border border-violet-100 hover:border-violet-300'
                  }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-fuchsia-600
                                   px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                    Recommandé
                  </div>
                )}
                <h3 className="text-xl font-display font-bold text-violet-950">{plan.name}</h3>
                <div className="mt-3 text-3xl font-extrabold text-violet-950">{plan.price}</div>
                <ul className="mt-8 flex-grow space-y-4 text-sm text-slate-700">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-emerald-600 text-[18px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link
                  to={ROUTES.REGISTER}
                  className={`mt-8 w-full text-center ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8" id="faq">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-display font-bold text-violet-950">
            Questions fréquentes
          </h2>
          <div className="mt-12 space-y-4">
            {faqs.map((faq) => (
              <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-slate-900 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <Logo size="sm" />
            <p className="mt-4 text-sm text-slate-300">
              La plateforme marocaine d&apos;apprentissage de l&apos;IA nouvelle génération.
              Visualisez le futur, maîtrisez la technologie.
            </p>
            <div className="mt-6 flex gap-3">
              {['LinkedIn', 'X', 'Instagram'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold
                             text-white/70 hover:bg-white/20 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Ressources', links: ['Documentation', 'Webinaires', 'Tutoriels', 'Open Source'] },
            { title: 'Entreprise',  links: ['À propos', 'Blog', 'Carrières', 'Contact'] },
            { title: 'Légal',       links: ["Confidentialité", "Conditions d'usage", 'Cookies'] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-violet-300 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4
                        border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row">
          <p>© 2026 IAAI eLearning 101 — Fièrement conçu au Maroc</p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span>Tous les systèmes sont opérationnels</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default LandingPage