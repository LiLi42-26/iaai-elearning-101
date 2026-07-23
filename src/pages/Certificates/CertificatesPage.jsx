// src/pages/Certificates/CertificatesPage.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { ROUTES } from '@/constants/routes'
import { getUserCertificates, checkCertificateEligibility } from '@/services/certificateService'
import { getOverallProgress } from '@/services/progressService'

// ─── Skeleton ────────────────────────────────────────────────────────────────
function CertSkeleton() {
  return (
    <div className="pb-12 animate-pulse">
      <div className="h-8 w-64 bg-[#e5eeff] rounded mb-2" />
      <div className="h-4 w-48 bg-[#e5eeff] rounded mb-8" />
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-[#e5eeff] rounded-2xl" />)}
      </div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-[60%] h-96 bg-[#e5eeff] rounded-2xl" />
        <div className="w-full lg:w-[40%] flex flex-col gap-4">
          <div className="h-48 bg-[#e5eeff] rounded-2xl" />
          <div className="h-40 bg-[#e5eeff] rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

// ─── Certificat vide (pas encore décroché) ────────────────────────────────────
function EmptyState({ eligibility }) {
  const { completedModules = 0, totalModules = 0 } = eligibility || {}
  const percent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0

  return (
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-[#0b1c30]">Mes Certificats</h1>
        <p className="text-sm text-[#7e7385] mt-1">Suivez vos réussites et téléchargez vos diplômes officiels IAAI.</p>
      </div>

      <div className="bg-white rounded-2xl border border-[#8127cf]/10 shadow-sm p-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-[#eef1ff] flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-[48px] text-[#a89fb5]">workspace_premium</span>
        </div>
        <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Pas encore de certificat</h3>
        <p className="text-[#7e7385] text-sm max-w-md mb-8">
          Terminez les {totalModules || '7'} modules pour obtenir votre certificat AI Foundations 101
        </p>

        <div className="w-full max-w-md mb-8">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="font-bold text-[#8127cf]">{percent}% du parcours complété</span>
            <span className="text-[#7e7385]">{completedModules}/{totalModules} Modules</span>
          </div>
          <div className="h-2 w-full bg-[#eef1ff] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${percent}%`, background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
            />
          </div>
        </div>

        <Link
          to={ROUTES.CURRICULUM}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-sm
                     hover:shadow-lg active:scale-[0.98] transition-all"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
        >
          Continuer mon parcours
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </Link>
      </div>

      {/* Aperçu verrouillé */}
      <div className="mt-6 border-2 border-dashed border-[#ded6f3] rounded-2xl p-6 flex items-center gap-6">
        <div className="w-32 h-24 rounded-xl bg-[#eef1ff] flex items-center justify-center flex-shrink-0">
          <span className="material-symbols-outlined text-[36px] text-[#c5bdd6]">visibility_off</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-[#0b1c30]">Certificat AI Foundations 101</h4>
            <span className="material-symbols-outlined text-[16px] text-[#a89fb5]">lock</span>
          </div>
          <p className="text-xs text-[#7e7385] mb-3">IAAI e-learning 101 — Maroc</p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#7e7385]">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] text-green-500">check_circle</span>
              {completedModules}/{totalModules || 7} modules complétés
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">quiz</span>
              Score minimum 70% à chaque quiz
            </span>
          </div>
        </div>
        <span className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#f0f0f5] text-[#7e7385] text-xs font-bold flex-shrink-0">
          <span className="material-symbols-outlined text-[14px]">lock</span>
          Verrouillé
        </span>
      </div>
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function CertificatesPage() {
  const { user } = useAuthStore()
  const fullName = user?.fullName || 'Apprenant'

  const [certificate, setCertificate] = useState(null)
  const [eligibility, setEligibility] = useState(null)
  const [progress, setProgress]       = useState(null)
  const [loading, setLoading]         = useState(true)
  const [copied, setCopied]           = useState(false)

  useEffect(() => {
    if (!user?.id) return
    const load = async () => {
      try {
        const [certs, elig, prog] = await Promise.all([
          getUserCertificates(user.id),
          checkCertificateEligibility(user.id),
          getOverallProgress(user.id),
        ])
        setCertificate(certs[0] || null)
        setEligibility(elig)
        setProgress(prog)
      } catch (err) {
        console.error('Erreur chargement certificats:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  const handleCopyLink = () => {
    if (!certificate) return
    navigator.clipboard.writeText(`${window.location.origin}${ROUTES.VERIFY_CERTIFICATE(certificate.certificate_number)}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Ouvre le flux LinkedIn « Ajouter à mon profil » pré-rempli avec le certificat.
  const handleShareLinkedIn = () => {
    if (!certificate) return
    const issued = new Date(certificate.issued_at)
    const certUrl = `${window.location.origin}${ROUTES.VERIFY_CERTIFICATE(certificate.certificate_number)}`
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: 'AI Foundations 101 — Intelligence Artificielle',
      organizationName: 'IAAI Academy',
      issueYear: String(issued.getFullYear()),
      issueMonth: String(issued.getMonth() + 1),
      certId: certificate.certificate_number,
      certUrl,
    })
    window.open(
      `https://www.linkedin.com/profile/add?${params.toString()}`,
      '_blank',
      'noopener,noreferrer',
    )
  }

  const handleDownloadPdf = () => window.print()

  if (loading) return <CertSkeleton />
  if (!certificate) return <EmptyState eligibility={eligibility} />

  const date = new Date(certificate.issued_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  const stats = [
    { icon: 'workspace_premium', value: '1',                                      label: 'certificat obtenu',   bg: '#dcfce7', color: '#16a34a' },
    { icon: 'grid_view',         value: `${eligibility?.totalModules ?? 7}`,       label: 'modules complétés',   bg: '#f0dbff', color: '#8127cf' },
    { icon: 'menu_book',         value: `${progress?.completedLessons ?? 0}`,      label: 'leçons terminées',    bg: '#dbeafe', color: '#2563eb' },
  ]

  return (
    <div className="pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-[#0b1c30]">Mes Certificats</h1>
        <p className="text-sm text-[#7e7385] mt-1">Suivez vos réussites et téléchargez vos diplômes officiels IAAI.</p>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#8127cf]/10 shadow-sm p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              <span className="material-symbols-outlined text-[22px]" style={{ color: s.color }}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xl font-bold text-[#0b1c30]">{s.value}</p>
              <p className="text-xs text-[#7e7385]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Layout 2 colonnes ──────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Colonne gauche : Certificat (60%) ──────────────────────────────── */}
        <div className="w-full lg:w-[60%]">
          <div id="certificate-print" className="relative bg-white rounded-2xl shadow-xl border-2 border-yellow-400/60 p-8 md:p-12 overflow-hidden">

            {/* Badge OBTENU */}
            <span className="absolute top-5 right-5 flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-400 text-yellow-950 text-xs font-bold z-10">
              <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              OBTENU
            </span>

            {/* Filigrane */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
              <span className="material-symbols-outlined text-[400px]">verified_user</span>
            </div>

            <div className="relative z-[1] flex flex-col items-center text-center">
              <div className="w-full h-14 rounded-xl mb-10 flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
                <span className="text-white font-bold tracking-widest uppercase text-sm">IAAI ACADEMY</span>
              </div>

              <h2 className="text-2xl font-bold text-[#0b1c30] italic mb-4">Certificat de Complétion</h2>
              <div className="w-32 h-0.5 bg-yellow-500 mb-8" />

              <p className="text-[#7e7385] text-sm mb-4">Ce certificat est décerné à</p>
              <h3 className="text-4xl font-extrabold text-[#8127cf] mb-8 tracking-tight font-display">{fullName}</h3>

              <p className="max-w-md text-[#4d4354] text-base mb-10 leading-relaxed">
                Pour avoir complété avec succès le parcours{' '}
                <span className="font-bold">AI Foundations 101 — Intelligence Artificielle</span>
                {' '}avec un score de{' '}
                <span className="font-bold text-[#8127cf]">{certificate.score}%</span>
              </p>

              <div className="w-full flex flex-col md:flex-row justify-between items-end mt-8 px-4 gap-8">
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-4 border-yellow-500 flex items-center justify-center bg-yellow-50 mb-2">
                    <span className="material-symbols-outlined text-yellow-600 text-[40px]">verified</span>
                  </div>
                  <p className="text-xs text-[#7e7385] italic">Sceau Officiel</p>
                </div>

                <div className="text-center md:text-right">
                  <p className="text-sm text-[#4d4354] mb-2">Casablanca, {date}</p>
                  <div className="w-48 h-px bg-[#cfc2d6] mb-2" />
                  <p className="text-sm font-bold text-[#0b1c30]">Direction de l'IAAI Academy</p>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-[#f0f0f5] w-full">
                <p className="text-xs text-[#7e7385] uppercase tracking-widest">
                  IAAI Academy · Maroc · {certificate.certificate_number}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Colonne droite : Félicitations + actions (40%) ───────────────────── */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">

          {/* Félicitations */}
          <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(160deg, #f0dbff 0%, #fce7f3 100%)' }}>
            <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-yellow-600 text-[28px]">emoji_events</span>
            </div>
            <h4 className="text-lg font-bold font-display text-[#0b1c30] mb-2">Félicitations {fullName.split(' ')[0]} !</h4>
            <p className="text-sm text-[#4d4354]">
              Vous avez complété avec succès <span className="font-bold">AI Foundations 101</span>.
            </p>
          </div>

          {/* Détails */}
          <div className="bg-white rounded-2xl p-6 border border-[#8127cf]/10 shadow-sm">
            <h4 className="text-lg font-bold font-display text-[#0b1c30] mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8127cf]">info</span>
              Détails du parcours
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Parcours',       value: 'AI Foundations 101', type: 'text' },
                { label: 'Niveau',         value: 'Débutant',           type: 'badge' },
                { label: 'Score obtenu',   value: `${certificate.score}%`, type: 'score' },
                { label: 'Date obtention', value: date,                 type: 'text' },
                { label: 'Numéro',         value: certificate.certificate_number, type: 'mono' },
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[#f0f0f5] last:border-0">
                  <span className="text-sm text-[#7e7385]">{item.label}</span>
                  {item.type === 'badge' && (
                    <span className="bg-[#f0dbff] text-[#8127cf] px-3 py-1 rounded-full text-xs font-bold">{item.value}</span>
                  )}
                  {item.type === 'score' && <span className="text-green-600 font-bold text-sm">{item.value}</span>}
                  {item.type === 'text' && <span className="font-bold text-[#0b1c30] text-sm text-right max-w-[60%] truncate">{item.value}</span>}
                  {item.type === 'mono' && <span className="font-mono text-xs text-[#0b1c30] font-bold">{item.value}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Partager */}
          <div className="bg-white rounded-2xl p-6 border border-[#8127cf]/10 shadow-sm">
            <h4 className="text-lg font-bold font-display text-[#0b1c30] mb-5 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8127cf]">share</span>
              Partager
            </h4>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleShareLinkedIn}
                className="w-full bg-[#0077B5] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                Partager sur LinkedIn
              </button>
              <button
                onClick={handleDownloadPdf}
                className="w-full text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-md transition-all"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
                <span className="material-symbols-outlined text-[18px]">download</span>
                Télécharger en PDF
              </button>
              <button
                onClick={handleCopyLink}
                className="w-full border border-[#8127cf] text-[#8127cf] py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#8127cf]/5 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">{copied ? 'check' : 'link'}</span>
                {copied ? 'Lien copié !' : 'Copier le lien public'}
              </button>
            </div>
          </div>

          {/* Vérification */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#8127cf]/10 shadow-sm">
            <h4 className="text-lg font-bold font-display text-[#0b1c30] mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8127cf]">verified</span>
              Vérification
            </h4>
            <p className="text-sm text-[#7e7385] mb-1">
              ID unique : <span className="font-mono font-bold text-[#0b1c30]">{certificate.certificate_number}</span>
            </p>
            <p className="text-xs text-[#7e7385] italic">
              Ce certificat est vérifiable en ligne via notre portail de sécurité.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
