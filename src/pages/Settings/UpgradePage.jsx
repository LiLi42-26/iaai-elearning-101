// src/pages/Settings/UpgradePage.jsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/services/supabaseClient'

// ─── Données ──────────────────────────────────────────────────────────────────
const features = [
  { label: 'Module 1 — Introduction à l\'IA',   included: true,  both: true  },
  { label: 'Quiz de fin de leçon',               included: true,  both: true  },
  { label: 'Suivi de progression',               included: true,  both: true  },
  { label: 'Modules 2 à 8 complets',             included: false, both: false },
  { label: 'Certificat de complétion IAAI',      included: false, both: false },
  { label: 'Assistant ARIA illimité',            included: false, both: false },
  { label: 'Projets pratiques guidés',           included: false, both: false },
  { label: 'Communauté premium',                 included: false, both: false },
  { label: 'Support prioritaire',                included: false, both: false },
]

const faqs = [
  {
    q: 'C\'est un paiement unique ou un abonnement ?',
    a: 'C\'est un paiement unique de 299 MAD. Vous accédez à la plateforme à vie, sans frais récurrents.',
  },
  {
    q: 'Quels modes de paiement sont acceptés ?',
    a: 'Nous acceptons les cartes Visa et Mastercard via Stripe, une plateforme de paiement sécurisée utilisée par des millions d\'entreprises.',
  },
  {
    q: 'Y a-t-il une garantie de remboursement ?',
    a: 'Oui ! Nous offrons une garantie satisfait ou remboursé de 7 jours sans condition.',
  },
  {
    q: 'Le certificat est-il reconnu ?',
    a: 'Le certificat IAAI eLearning 101 est délivré par IAAI Academy et peut être partagé sur LinkedIn. Il atteste de vos compétences en IA.',
  },
  {
    q: 'Que se passe-t-il après le paiement ?',
    a: 'Votre accès Premium est activé immédiatement après confirmation du paiement. Vous pouvez commencer le Module 2 dans la minute.',
  },
]

// ─── Page principale ──────────────────────────────────────────────────────────
export default function UpgradePage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const isPremium = user?.plan === 'premium'

  // ── Lancer le checkout Stripe ─────────────────────────────────────────────
  async function handleCheckout() {
    if (!user) { navigate(ROUTES.LOGIN); return }
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const token = session?.access_token
      if (!token) throw new Error('Session expirée, veuillez vous reconnecter')

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur lors du paiement')

      // Rediriger vers Stripe Checkout
      window.location.href = data.url

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f8f5ff] pb-16">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f0dbff] text-[#8127cf] text-sm font-semibold mb-4">
          <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
          Plan &amp; Abonnement
        </div>
        <h2 className="text-4xl font-bold font-display text-[#0b1c30] mb-3">
          {isPremium ? 'Vous êtes Premium 🎉' : 'Débloquez tout votre potentiel'}
        </h2>
        <p className="text-[#68627a] max-w-md mx-auto">
          {isPremium
            ? 'Vous avez accès à l\'intégralité du parcours IA, aux projets pratiques et à l\'assistant ARIA.'
            : 'Un seul paiement de 299 MAD pour accéder à l\'intégralité du parcours IA.'}
        </p>
      </div>

      {/* ── Bannière Premium actif ─────────────────────────────────────────── */}
      {isPremium && (
        <div className="max-w-2xl mx-auto mb-10">
          <div className="rounded-2xl p-6 text-white text-center" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 50%, #0891b2 100%)' }}>
            <span className="material-symbols-outlined text-[40px] mb-2">verified</span>
            <p className="text-xl font-bold font-display mb-1">Accès Premium actif</p>
            <p className="text-sm opacity-80">Vous avez accès à tous les modules, quiz et au certificat.</p>
            <Link to={ROUTES.CURRICULUM}
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-bold transition-colors">
              <span className="material-symbols-outlined text-[18px]">play_circle</span>
              Continuer la formation
            </Link>
          </div>
        </div>
      )}

      {/* ── Carte de prix ──────────────────────────────────────────────────── */}
      {!isPremium && (
        <div className="max-w-2xl mx-auto mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Plan Gratuit */}
            <div className="bg-white rounded-2xl border-2 border-[#ded6f3] p-7">
              <h3 className="text-lg font-bold font-display text-[#17132f] mb-2">Gratuit</h3>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-bold text-[#68627a]">0</span>
                <span className="text-[#68627a] text-sm mb-1">MAD</span>
              </div>
              <ul className="space-y-3 mb-7">
                {features.map((f, i) => (
                  <li key={i} className={`flex items-center gap-3 text-sm ${f.both ? 'text-[#17132f]' : 'text-[#68627a]/40'}`}>
                    {f.both
                      ? <span className="material-symbols-outlined text-[18px] text-[#68627a]">check_circle</span>
                      : <span className="material-symbols-outlined text-[18px] text-[#ded6f3]">cancel</span>}
                    {f.label}
                  </li>
                ))}
              </ul>
              <div className="w-full py-3.5 rounded-xl bg-[#f0dbff] text-[#8127cf] text-sm font-bold text-center">
                ✓ Plan actuel
              </div>
            </div>

            {/* Plan Premium */}
            <div className="relative bg-white rounded-2xl border-2 border-[#8127cf] overflow-hidden">
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 50%, #0891b2 100%)' }} />
              <div className="absolute top-5 right-4">
                <span className="text-xs font-bold text-white px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}>
                  🔥 Accès complet
                </span>
              </div>
              <div className="p-7">
                <h3 className="text-lg font-bold font-display text-[#17132f] mb-2">Premium</h3>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-bold" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    299
                  </span>
                  <span className="text-[#68627a] text-sm mb-1">MAD</span>
                </div>
                <p className="text-xs text-[#8127cf] font-medium mb-6">Paiement unique — Accès à vie</p>
                <ul className="space-y-3 mb-7">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-[#17132f]">
                      <span className="material-symbols-outlined text-[18px] text-[#8127cf]">check_circle</span>
                      {f.label}
                    </li>
                  ))}
                </ul>

                {/* Erreur */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 flex items-start gap-2">
                    <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0">error</span>
                    <p className="text-xs text-red-700">{error}</p>
                  </div>
                )}

                {/* Bouton Stripe */}
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-white text-sm font-bold transition-all hover:shadow-lg hover:shadow-[#8127cf]/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Redirection vers Stripe...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">lock_open</span>
                      Passer Premium — 299 MAD
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 mt-3">
                  <span className="material-symbols-outlined text-[#8127cf]/50 text-[14px]">lock</span>
                  <p className="text-xs text-[#8127cf]/50">Paiement sécurisé via Stripe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Ce que vous débloquez ──────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto mb-14">
        <h3 className="text-2xl font-bold font-display text-center text-[#0b1c30] mb-8">
          Ce que vous débloquez avec Premium
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { icon: 'school',            color: 'text-violet-600', bg: 'bg-violet-50', title: '7 modules complets',  desc: 'Des bases jusqu\'aux LLMs et IA générative' },
            { icon: 'smart_toy',         color: 'text-cyan-600',   bg: 'bg-cyan-50',   title: 'ARIA sans limite',    desc: 'Assistant IA personnel disponible 24h/24' },
            { icon: 'workspace_premium', color: 'text-yellow-600', bg: 'bg-yellow-50', title: 'Certificat officiel', desc: 'Certifié IAAI Academy, partageable sur LinkedIn' },
            { icon: 'code',              color: 'text-pink-600',   bg: 'bg-pink-50',   title: 'Notebooks Python',    desc: 'Pratiquez dans un environnement JupyterLite intégré' },
            { icon: 'groups',            color: 'text-green-600',  bg: 'bg-green-50',  title: 'Communauté premium',  desc: 'Accès aux sessions live et aux mentors' },
            { icon: 'headset_mic',       color: 'text-orange-600', bg: 'bg-orange-50', title: 'Support prioritaire', desc: 'Réponse garantie en moins de 24 heures' },
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

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
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
    </div>
  )
}