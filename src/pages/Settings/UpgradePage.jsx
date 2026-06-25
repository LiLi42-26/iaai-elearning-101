// src/pages/Settings/UpgradePage.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// ─── Données ──────────────────────────────────────────────────────────────────
const plans = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    price: { monthly: '0', yearly: '0' },
    currency: 'MAD',
    period: '/mois',
    badge: null,
    gradient: null,
    border: 'border-[#ded6f3]',
    features: [
      { label: 'Accès à 2 modules sur 7',                 included: true  },
      { label: 'Quiz de fin de module',                    included: true  },
      { label: 'Certificat de complétion',                 included: false },
      { label: 'Accès aux 7 modules complets',             included: false },
      { label: 'Projets pratiques guidés',                 included: false },
      { label: 'Assistant ARIA illimité',                  included: false },
      { label: 'Notebooks JupyterLite',                    included: false },
      { label: 'Communauté premium',                       included: false },
      { label: 'Support prioritaire',                      included: false },
    ],
    cta: 'Plan actuel',
    ctaDisabled: true,
  },
  {
    id: 'illimite',
    name: 'Illimité',
    price: { monthly: '99', yearly: '79' },
    currency: 'MAD',
    period: '/mois',
    badge: '🔥 Le plus populaire',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #8127cf 50%, #0891b2 100%)',
    border: 'border-[#8127cf]',
    features: [
      { label: 'Accès à 2 modules sur 7',                 included: true  },
      { label: 'Quiz de fin de module',                    included: true  },
      { label: 'Certificat de complétion',                 included: true  },
      { label: 'Accès aux 7 modules complets',             included: true  },
      { label: 'Projets pratiques guidés',                 included: true  },
      { label: 'Assistant ARIA illimité',                  included: true  },
      { label: 'Notebooks JupyterLite',                    included: true  },
      { label: 'Communauté premium',                       included: true  },
      { label: 'Support prioritaire',                      included: true  },
    ],
    cta: 'Passer à Illimité',
    ctaDisabled: false,
  },
]

const faqs = [
  {
    q: 'Puis-je annuler mon abonnement à tout moment ?',
    a: 'Oui, vous pouvez annuler à tout moment depuis vos paramètres. Vous conservez l\'accès jusqu\'à la fin de la période payée.',
  },
  {
    q: 'Quels modes de paiement sont acceptés ?',
    a: 'Nous acceptons les cartes Visa/Mastercard, le virement bancaire, et bientôt Orange Money et Wafacash.',
  },
  {
    q: 'Y a-t-il une garantie de remboursement ?',
    a: 'Oui ! Nous offrons une garantie satisfait ou remboursé de 7 jours sans condition.',
  },
  {
    q: 'Le certificat est-il reconnu ?',
    a: 'Le certificat IAAI eLearning 101 est délivré par IAAI Academy et peut être partagé sur LinkedIn. Il atteste de vos compétences en IA.',
  },
]

// ─── Page principale ──────────────────────────────────────────────────────────
export default function UpgradePage() {
  const [billing, setBilling] = useState('monthly')
  const [openFaq, setOpenFaq] = useState(null)
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8f5ff] pb-16">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0dbff] text-[#8127cf] text-sm font-semibold mb-4">
          <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
          Plan & Abonnement
        </div>
        <h2 className="text-4xl font-bold font-display text-[#0b1c30] mb-3">
          Débloquez tout votre potentiel
        </h2>
        <p className="text-[#68627a] max-w-md mx-auto">
          Passez au plan Illimité et accédez à l'intégralité du parcours IA, aux projets pratiques et à l'assistant ARIA.
        </p>
      </div>

      {/* ── Toggle mensuel / annuel ───────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <span className={`text-sm font-medium ${billing === 'monthly' ? 'text-[#17132f]' : 'text-[#68627a]'}`}>Mensuel</span>
        <button
          onClick={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${billing === 'yearly' ? 'bg-[#8127cf]' : 'bg-[#ded6f3]'}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${billing === 'yearly' ? 'translate-x-6' : ''}`} />
        </button>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${billing === 'yearly' ? 'text-[#17132f]' : 'text-[#68627a]'}`}>Annuel</span>
          <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">-20%</span>
        </div>
      </div>

      {/* ── Cartes de plans ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-14">
        {plans.map(plan => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 ${plan.border} bg-white overflow-hidden transition-all hover:shadow-xl`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute top-4 right-4">
                <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}>
                  {plan.badge}
                </span>
              </div>
            )}

            {/* Gradient top bar */}
            {plan.gradient && (
              <div className="h-1.5 w-full" style={{ background: plan.gradient }} />
            )}

            <div className="p-7">
              {/* Plan name + price */}
              <div className="mb-6">
                <h3 className="text-xl font-bold font-display text-[#17132f] mb-3">{plan.name}</h3>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold" style={plan.gradient ? { background: plan.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: '#68627a' }}>
                    {billing === 'yearly' ? plan.price.yearly : plan.price.monthly}
                  </span>
                  <span className="text-[#68627a] text-sm mb-1">{plan.currency}{plan.period}</span>
                </div>
                {billing === 'yearly' && plan.id === 'illimite' && (
                  <p className="text-xs text-green-600 font-medium mt-1">Économisez 240 MAD/an</p>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-7">
                {plan.features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${f.included ? 'text-[#17132f]' : 'text-[#68627a]/50'}`}>
                    {f.included ? (
                      <span className="material-symbols-outlined text-[18px]" style={{ color: plan.gradient ? '#8127cf' : '#68627a' }}>check_circle</span>
                    ) : (
                      <span className="material-symbols-outlined text-[18px] text-[#ded6f3]">cancel</span>
                    )}
                    {f.label}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                onClick={() => !plan.ctaDisabled && setShowConfirm(true)}
                disabled={plan.ctaDisabled}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                  plan.ctaDisabled
                    ? 'bg-[#f0dbff] text-[#8127cf] cursor-default'
                    : 'text-white hover:shadow-lg hover:shadow-[#8127cf]/20 hover:scale-[1.02] active:scale-[0.98]'
                }`}
                style={plan.ctaDisabled ? {} : { background: plan.gradient }}
              >
                {plan.ctaDisabled ? '✓ ' + plan.cta : plan.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Ce que vous débloquez ─────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto mb-14">
        <h3 className="text-2xl font-bold font-display text-center text-[#0b1c30] mb-8">
          Ce que vous débloquez avec Illimité
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: 'school',           color: 'text-violet-600',  bg: 'bg-violet-50', title: '7 modules complets',   desc: 'Des bases jusqu\'aux LLMs et IA générative' },
            { icon: 'smart_toy',        color: 'text-cyan-600',    bg: 'bg-cyan-50',   title: 'ARIA sans limite',      desc: 'Assistant IA personnel disponible 24h/24' },
            { icon: 'workspace_premium',color: 'text-yellow-600',  bg: 'bg-yellow-50', title: 'Certificat officiel',   desc: 'Certifié IAAI Academy, partageable sur LinkedIn' },
            { icon: 'code',             color: 'text-pink-600',    bg: 'bg-pink-50',   title: 'Notebooks Python',      desc: 'Pratiquez dans un environnement JupyterLite intégré' },
            { icon: 'groups',           color: 'text-green-600',   bg: 'bg-green-50',  title: 'Communauté premium',    desc: 'Accès aux sessions live et aux mentors' },
            { icon: 'headset_mic',      color: 'text-orange-600',  bg: 'bg-orange-50', title: 'Support prioritaire',   desc: 'Réponse garantie en moins de 24 heures' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-2xl border border-[#ded6f3] p-5 hover:shadow-sm transition-shadow">
              <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-3`}>
                <span className={`material-symbols-outlined text-[22px] ${f.color}`}>{f.icon}</span>
              </div>
              <p className="text-sm font-bold text-[#17132f] mb-1">{f.title}</p>
              <p className="text-xs text-[#68627a] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── FAQ ──────────────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold font-display text-center text-[#0b1c30] mb-6">Questions fréquentes</h3>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#ded6f3] overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#f8f5ff] transition-colors"
              >
                <span className="text-sm font-semibold text-[#17132f] pr-4">{faq.q}</span>
                <span className={`material-symbols-outlined text-[#8127cf] text-[20px] transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#68627a] leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Modal confirmation paiement ────────────────────────────────────────── */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}>
                <span className="material-symbols-outlined text-white text-[28px]">workspace_premium</span>
              </div>
              <h3 className="text-xl font-bold font-display text-[#17132f] mb-2">Passer à Illimité</h3>
              <p className="text-sm text-[#68627a]">
                {billing === 'yearly' ? '79 MAD/mois, facturé annuellement' : '99 MAD/mois'}
              </p>
            </div>
            <div className="bg-[#f8f5ff] rounded-xl p-4 mb-6 space-y-2">
              {['7 modules complets', 'Certificat officiel', 'ARIA sans limite', 'Support prioritaire'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-[#17132f]">
                  <span className="material-symbols-outlined text-[#8127cf] text-[16px]">check_circle</span>
                  {f}
                </div>
              ))}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-500 text-[18px] shrink-0">info</span>
              <p className="text-xs text-amber-700">L'intégration de paiement Stripe est en cours. Cette action est une démonstration pour le MVP.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 rounded-xl border border-[#ded6f3] text-[#68627a] text-sm font-medium hover:bg-[#f8f5ff] transition-colors">
                Annuler
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold hover:shadow-lg transition-all"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
              >
                Confirmer (Démo)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
