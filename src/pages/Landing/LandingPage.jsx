// src/pages/Landing/LandingPage.jsx
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import Logo from '@/components/ui/Logo'
import FAQSection from '@/components/ui/FAQSection'
import TestimonialsCarousel from '@/components/ui/TestimonialsCarousel'
import progressArtImg from '@/assets/modules/module2-deeplearning.png'
import neuralPlayerImg from '@/assets/neural-network.jpg'

const stats = [
  { value: '2 400+', label: 'Apprenants' },
  { value: '4.9★', label: 'Note moyenne' },
  { value: '64h', label: 'De contenu' },
  { value: '92%', label: 'Complétion' },
]

const reasons = [
  {
    icon: 'visibility',
    title: 'Moteur Visuel-First',
    text: "Visualisez les concepts de l'IA sous forme d'animations interactives. Chaque notion abstraite devient une image claire.",
  },
  {
    icon: 'hub',
    title: 'Neuro-Learning',
    text: "Un cursus structuré selon les découvertes en sciences cognitives pour maximiser la rétention et la mémorisation à long terme.",
  },
  {
    icon: 'workspace_premium',
    title: 'Certification Pro',
    text: "Obtenez un certificat de compétences reconnu par nos leaders de l'industrie technologique, valide votre capacité à appliquer concrètement l'IA.",
  },
]

const steps = [
  {
    number: '1',
    title: 'Créez votre compte',
    text: "Inscription rapide, puis vérification email pour sécuriser le compte.",
  },
  {
    number: '2',
    title: 'Apprentissage immersif',
    text: "Regardez les animations, suivez les ressources et validez chaque étape par quiz.",
  },
  {
    number: '3',
    title: 'Certification',
    text: "Terminez le parcours et téléchargez votre certificat IAAI eLearning 101.",
  },
]

const plans = [
  {
    name: 'Gratuit',
    price: '0 MAD',
    period: '',
    cta: "S'inscrire",
    highlighted: false,
    items: ['Module 1 complet', 'Accès à la communauté', { text: 'Pas de certificat', disabled: true }],
  },
  {
    name: 'Illimité',
    price: '299 MAD',
    period: 'paiement unique',
    cta: 'Commencer maintenant',
    highlighted: true,
    badge: 'LE PLUS POPULAIRE',
    items: ['Accès à tous les modules', 'Modules interactifs 3D', 'Certificat officiel IAAI', 'Accès à vie, sans abonnement'],
  },
  {
    name: 'Équipe',
    price: 'Sur mesure',
    period: '',
    cta: 'Contacter les ventes',
    highlighted: false,
    items: ["Licences d'équipe (5+)", 'Dashboard admin RH', 'Formation personnalisée'],
  },
]

// ── Illustrations décoratives ────────────────────────────────────────────────
function ProgressPreviewArt() {
  return (
    <div className="w-full h-full rounded-2xl shadow-xl overflow-hidden">
      <img
        src={progressArtImg}
        alt="Suivez votre progression"
        className="w-full h-full object-cover"
      />
    </div>
  )
}

function NeuralPlayerArt() {
  return (
    <div className="w-full h-full rounded-2xl shadow-xl relative overflow-hidden group">
      <img
        src={neuralPlayerImg}
        alt="Apprenez avec le Python Video Player"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/10" />
      <button className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-white/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
        <span className="material-symbols-outlined text-[28px] text-[#8127cf]" style={{ fontVariationSettings: "'FILL' 1" }}>
          play_arrow
        </span>
      </button>
    </div>
  )
}

// ── Page principale ───────────────────────────────────────────────────────────
function LandingPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="absolute -left-28 top-4 h-72 w-72 rounded-full bg-[#8127cf]/15 blur-3xl" />
        <div className="absolute -right-28 bottom-4 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="mx-auto mb-8 flex w-fit items-center gap-1.5 rounded-full bg-[#f0dbff] px-4 py-1.5 text-sm font-semibold text-[#8127cf]">
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              auto_awesome
            </span>
            e-learning 101 · Nouvelle génération
          </p>

          <h1 className="mx-auto max-w-4xl text-3xl font-bold font-display text-[#0b1c30] sm:text-4xl md:text-5xl leading-[1.2]">
            La première plateforme francophone qui enseigne l'IA avec des{' '}
            <span style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              animations immersives
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#7e7385]">
            Oubliez les cours théoriques ennuyeux. Plongez dans un univers où les concepts
            mathématiques deviennent des paysages interactifs et mémorables.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to={ROUTES.REGISTER}
              className="flex items-center gap-2 px-8 py-4 rounded-full text-white font-bold text-sm
                         hover:shadow-lg hover:shadow-[#8127cf]/20 active:scale-[0.98] transition-all group"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
            >
              Démarrer le cours
              <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
            <a
              href="#comment-ca-marche"
              className="px-8 py-4 rounded-full border-2 border-[#8127cf]/20 text-[#8127cf] font-bold text-sm hover:bg-[#8127cf]/5 transition-all"
            >
              Voir la démo
            </a>
          </div>

          <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-6 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-extrabold text-[#0b1c30]">{stat.value}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-[#a89fb5]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pourquoi nous choisir ────────────────────────────────────────── */}
      <section className="bg-[#f8f5ff] px-4 py-24 sm:px-6 lg:px-8" id="features">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-display font-bold text-[#0b1c30] mb-16">
            Pourquoi nous choisir ?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reasons.map((reason) => (
              <article
                key={reason.title}
                className="rounded-2xl border border-[#8127cf]/10 bg-white p-8 hover:shadow-md transition-shadow"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0dbff]">
                  <span className="material-symbols-outlined text-[22px] text-[#8127cf]">{reason.icon}</span>
                </div>
                <h3 className="text-lg font-display font-bold text-[#0b1c30]">{reason.title}</h3>
                <p className="mt-3 text-sm text-[#7e7385] leading-relaxed">{reason.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Un parcours sans friction ────────────────────────────────────── */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8" id="cursus">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-display font-bold text-[#0b1c30] mb-16">
            Un parcours sans friction
          </h2>

          <div className="grid items-center gap-12 md:grid-cols-2 mb-20">
            <div>
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-[#f0dbff] text-[#8127cf] text-xs font-bold uppercase tracking-wide">
                Dashboard intuitif
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-[#0b1c30]">
                Suivez votre progression en temps réel
              </h3>
              <p className="mt-4 text-[#7e7385] leading-relaxed">
                Notre tableau de bord intuitif vous permet de visualiser vos avancées, de reprendre là où vous étiez et de voir quels concepts vous avez déjà maîtrisés.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#4d4354]">
                {['Vue d\'ensemble de votre parcours', 'Badges de progression débloqués'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="h-72">
              <ProgressPreviewArt />
            </div>
          </div>

          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="h-72 md:order-1 order-2">
              <NeuralPlayerArt />
            </div>
            <div className="md:order-2 order-1">
              <span className="inline-block mb-4 px-3 py-1 rounded-full bg-[#fce7f3] text-[#ec4899] text-xs font-bold uppercase tracking-wide">
                Lecteur vidéo animé
              </span>
              <h3 className="text-2xl md:text-3xl font-display font-bold text-[#0b1c30]">
                Apprenez avec le Python Video Player
              </h3>
              <p className="mt-4 text-[#7e7385] leading-relaxed">
                Ne vous contentez pas de regarder. Interagissez avec le code directement dans le lecteur vidéo. Modifiez les paramètres et voyez l'impact sur l'IA en direct.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-[#4d4354]">
                {['Code sandbox intégré au flux vidéo', 'Animations synchronisées au code'].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-green-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────────────────── */}
      <section className="bg-[#f8f5ff] px-4 py-24 sm:px-6 lg:px-8" id="comment-ca-marche">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="text-3xl font-display font-bold text-[#0b1c30]">Comment ça marche ?</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-3 relative">
            <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-0.5 bg-[#ded6f3] -z-10" />
            {steps.map((step, i) => (
              <article key={step.number} className="flex flex-col items-center">
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white shadow-lg"
                  style={{ background: ['#8127cf', '#ec4899', '#0891b2'][i] }}
                >
                  {step.number}
                </div>
                <h3 className="text-xl font-display font-bold text-[#0b1c30]">{step.title}</h3>
                <p className="mt-3 max-w-xs text-sm text-[#7e7385]">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Témoignages ──────────────────────────────────────────────────── */}
      <TestimonialsCarousel />

      {/* ── Tarifs ───────────────────────────────────────────────────────── */}
      <section className="bg-white px-4 py-24 sm:px-6 lg:px-8" id="pricing">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold text-[#0b1c30]">Investissez dans votre futur</h2>
            <p className="mt-4 text-[#7e7385]">Des options flexibles pour tous les niveaux de passion.</p>
          </div>
          <div className="grid items-stretch gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-3xl bg-white p-8 transition
                  ${plan.highlighted
                    ? 'border-2 border-[#8127cf] shadow-xl shadow-[#8127cf]/10 md:scale-105'
                    : 'border border-[#8127cf]/10 hover:border-[#8127cf]/30'
                  }`}
              >
                {plan.badge && (
                  <div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-white"
                    style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
                  >
                    {plan.badge}
                  </div>
                )}
                <h3 className="text-lg font-display font-bold text-[#0b1c30]">{plan.name}</h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-[#0b1c30]">{plan.price}</span>
                  {plan.period && <span className="text-sm text-[#7e7385]">{plan.period}</span>}
                </div>
                <ul className="mt-8 flex-grow space-y-4 text-sm">
                  {plan.items.map((item) => {
                    const disabled = typeof item === 'object'
                    const label = disabled ? item.text : item
                    return (
                      <li key={label} className={`flex items-center gap-2 ${disabled ? 'text-[#c5bdd6]' : 'text-[#4d4354]'}`}>
                        <span
                          className="material-symbols-outlined text-[18px]"
                          style={{ fontVariationSettings: "'FILL' 1", color: disabled ? '#ded6f3' : '#16a34a' }}
                        >
                          {disabled ? 'cancel' : 'check_circle'}
                        </span>
                        {label}
                      </li>
                    )
                  })}
                </ul>
                <Link
                  to={ROUTES.REGISTER}
                  className={`mt-8 w-full text-center py-3 rounded-full font-bold text-sm transition-all
                    ${plan.highlighted
                      ? 'text-white hover:shadow-lg'
                      : 'border border-[#8127cf]/20 text-[#8127cf] hover:bg-[#8127cf]/5'}`}
                  style={plan.highlighted ? { background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' } : undefined}
                >
                  {plan.cta}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FAQSection />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#0b1c30] px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-4">
          <div>
            <Logo size="sm" />
            <p className="mt-4 text-sm text-white/60">
              La plateforme marocaine d&apos;apprentissage de l&apos;IA nouvelle génération.
              Visualisez le futur, maîtrisez la technologie.
            </p>
            <div className="mt-6 flex gap-3">
              {['LinkedIn', 'X', 'Instagram'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/20 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Ressources', links: ['Documentation', 'Webinaires', 'Tutoriels', 'Projets Open Source'] },
            { title: 'Entreprise',  links: ['À propos', 'Blog', 'Carrières', 'Contact'] },
            { title: 'Légal',       links: ['Confidentialité', "Conditions d'usage", 'Cookies'] },
          ].map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">{col.title}</h3>
              <ul className="mt-4 space-y-3 text-sm text-white/60">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="hover:text-[#f0abfc] transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col justify-between gap-4 border-t border-white/10 pt-8 text-sm text-white/50 md:flex-row">
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
