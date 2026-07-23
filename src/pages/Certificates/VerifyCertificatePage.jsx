// src/pages/Certificates/VerifyCertificatePage.jsx
// Page publique (sans connexion) de vérification d'un certificat par son numéro.
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { verifyCertificate } from '@/services/certificateService'
import logo from '@/assets/logo-iaai.png'

export default function VerifyCertificatePage() {
  const { certNumber } = useParams()
  const [state, setState] = useState({ loading: true, cert: null, error: false })

  useEffect(() => {
    let active = true
    const run = async () => {
      try {
        const cert = await verifyCertificate(certNumber)
        if (active) setState({ loading: false, cert, error: false })
      } catch {
        if (active) setState({ loading: false, cert: null, error: true })
      }
    }
    run()
    return () => { active = false }
  }, [certNumber])

  const { loading, cert, error } = state
  const isValid = !!cert?.valid

  const date = cert?.issued_at
    ? new Date(cert.issued_at).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <div className="min-h-screen bg-[#f8f5ff] flex flex-col items-center px-4 py-10">
      <Link to={ROUTES.HOME} className="mb-8">
        <img src={logo} alt="IAAI eLearning 101" className="h-14 object-contain" />
      </Link>

      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#8127cf]/10 p-8">
        <div className="flex flex-col items-center text-center">
          <span className="material-symbols-outlined text-[#8127cf] text-[28px] mb-2">verified</span>
          <h1 className="text-2xl font-bold font-display text-[#0b1c30]">Vérification de certificat</h1>
          <p className="text-sm text-[#7e7385] mt-1">IAAI Academy · Maroc</p>
        </div>

        <div className="mt-8">
          {loading && (
            <div className="animate-pulse space-y-4">
              <div className="h-16 bg-[#eef1ff] rounded-2xl" />
              <div className="h-40 bg-[#eef1ff] rounded-2xl" />
            </div>
          )}

          {!loading && !isValid && (
            <div className="flex flex-col items-center text-center py-6">
              <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-red-500 text-[40px]">gpp_bad</span>
              </div>
              <h2 className="text-lg font-bold text-[#0b1c30] mb-1">Certificat introuvable</h2>
              <p className="text-sm text-[#7e7385] max-w-sm">
                {error
                  ? "Une erreur est survenue lors de la vérification. Réessayez plus tard."
                  : `Aucun certificat ne correspond au numéro `}
                {!error && <span className="font-mono font-bold text-[#0b1c30]">{certNumber}</span>}
                {!error && '.'}
              </p>
            </div>
          )}

          {!loading && isValid && (
            <>
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-6">
                <span className="material-symbols-outlined text-green-600 text-[28px]">gpp_good</span>
                <div>
                  <p className="font-bold text-green-800">Certificat authentique</p>
                  <p className="text-xs text-green-700">Ce certificat a bien été délivré par IAAI Academy.</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Titulaire',      value: cert.holder_name || '—', type: 'text' },
                  { label: 'Parcours',       value: 'AI Foundations 101',    type: 'text' },
                  { label: 'Score obtenu',   value: `${cert.score}%`,        type: 'score' },
                  { label: 'Date obtention', value: date,                    type: 'text' },
                  { label: 'Numéro',         value: cert.certificate_number, type: 'mono' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-[#f0f0f5] last:border-0">
                    <span className="text-sm text-[#7e7385]">{item.label}</span>
                    {item.type === 'score'
                      ? <span className="text-green-600 font-bold text-sm">{item.value}</span>
                      : item.type === 'mono'
                        ? <span className="font-mono text-xs text-[#0b1c30] font-bold">{item.value}</span>
                        : <span className="font-bold text-[#0b1c30] text-sm text-right max-w-[60%] truncate">{item.value}</span>}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <Link
        to={ROUTES.HOME}
        className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#8127cf] hover:opacity-70 transition-opacity"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Retour à l'accueil
      </Link>
    </div>
  )
}
