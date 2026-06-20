// src/pages/Certificates/CertificatesPage.jsx
import { useAuthStore } from '@/store/authStore'

export default function CertificatesPage() {
  const { user } = useAuthStore()
  const fullName = user?.fullName || 'Ahmed M.'

  return (
    <div className="pb-12">

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display text-[#0b1c30]">
          AI Foundations 101
        </h1>
        <p className="text-sm text-[#7e7385] mt-1">Votre certificat de complétion</p>
      </div>

      {/* ── Layout 2 colonnes ────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Colonne gauche : Certificat (60%) ───────────────────────────────── */}
        <div className="w-full lg:w-[60%]">
          <div className="bg-white rounded-2xl shadow-xl border border-[#8127cf]/10
                          p-8 md:p-12 relative overflow-hidden">

            {/* Filigrane */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none
                            flex items-center justify-center">
              <span className="material-symbols-outlined text-[400px]">verified_user</span>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">

              {/* Banner IAAI Academy */}
              <div className="w-full h-14 rounded-xl mb-10 flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
                <span className="text-white font-bold tracking-widest uppercase text-sm">
                  IAAI ACADEMY
                </span>
              </div>

              {/* Titre certificat */}
              <h2 className="text-2xl font-bold text-[#0b1c30] italic mb-4">
                Certificat de Complétion
              </h2>
              <div className="w-32 h-0.5 bg-yellow-500 mb-8" />

              <p className="text-[#7e7385] text-sm mb-4">Ce certificat est décerné à</p>

              {/* Nom */}
              <h3 className="text-4xl font-extrabold text-[#8127cf] mb-8 tracking-tight font-display">
                {fullName}
              </h3>

              <p className="max-w-md text-[#4d4354] text-base mb-10 leading-relaxed">
                Pour avoir complété avec succès le parcours{' '}
                <span className="font-bold">
                  AI Foundations 101 — Intelligence Artificielle — Niveau Débutant
                </span>
              </p>

              {/* Footer certificat */}
              <div className="w-full flex flex-col md:flex-row justify-between
                              items-end mt-8 px-4 gap-8">
                {/* Sceau */}
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full border-4 border-yellow-500
                                  flex items-center justify-center bg-yellow-50 mb-2">
                    <span className="material-symbols-outlined text-yellow-600 text-[40px]">
                      verified
                    </span>
                  </div>
                  <p className="text-xs text-[#7e7385] italic">Sceau Officiel</p>
                </div>

                {/* Signature */}
                <div className="text-center md:text-right">
                  <p className="text-sm text-[#4d4354] mb-2">Casablanca, 15 Juin 2026</p>
                  <div className="w-48 h-px bg-[#cfc2d6] mb-2" />
                  <p className="text-sm font-bold text-[#0b1c30]">
                    Direction de l'IAAI Academy
                  </p>
                </div>
              </div>

              {/* Footer bas */}
              <div className="mt-12 pt-6 border-t border-[#f0f0f5] w-full">
                <p className="text-xs text-[#7e7385] uppercase tracking-widest">
                  IAAI Academy · Maroc
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ── Colonne droite : Actions (40%) ───────────────────────────────────── */}
        <div className="w-full lg:w-[40%] flex flex-col gap-4">

          {/* Détails du parcours */}
          <div className="bg-white rounded-2xl p-6 border border-[#8127cf]/10 shadow-sm">
            <h4 className="text-lg font-bold font-display text-[#0b1c30] mb-5
                           flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8127cf]">info</span>
              Détails du parcours
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Parcours',        value: 'AI Foundations 101',  type: 'text'  },
                { label: 'Niveau',          value: 'Débutant',             type: 'badge' },
                { label: 'Durée',           value: '17 heures',            type: 'text'  },
                { label: 'Modules',         value: '7/7 complétés',        type: 'text'  },
                { label: 'Score moyen',     value: '88%',                  type: 'score' },
                { label: 'Date obtention',  value: '15 Juin 2026',         type: 'text'  },
              ].map((item, i) => (
                <div key={i}
                     className={`flex justify-between items-center py-2
                                 ${i < 5 ? 'border-b border-[#f0f0f5]' : ''}`}>
                  <span className="text-sm text-[#7e7385]">{item.label}</span>
                  {item.type === 'badge' && (
                    <span className="bg-[#f0dbff] text-[#8127cf] px-3 py-1
                                     rounded-full text-xs font-bold">
                      {item.value}
                    </span>
                  )}
                  {item.type === 'score' && (
                    <span className="text-green-600 font-bold text-sm">{item.value}</span>
                  )}
                  {item.type === 'text' && (
                    <span className="font-bold text-[#0b1c30] text-sm">{item.value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Partager */}
          <div className="bg-white rounded-2xl p-6 border border-[#8127cf]/10 shadow-sm">
            <h4 className="text-lg font-bold font-display text-[#0b1c30] mb-5
                           flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8127cf]">share</span>
              Partager
            </h4>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-[#0077B5] text-white py-3 rounded-xl
                                 font-bold text-sm flex items-center justify-center gap-2
                                 hover:brightness-110 transition-all">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                Partager sur LinkedIn
              </button>

              <button
                className="w-full text-white py-3 rounded-xl font-bold text-sm
                           flex items-center justify-center gap-2
                           hover:scale-[1.01] active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
              >
                <span className="material-symbols-outlined text-[18px]">download</span>
                Télécharger en PDF
              </button>

              <button className="w-full border border-[#8127cf] text-[#8127cf] py-3
                                 rounded-xl font-bold text-sm
                                 flex items-center justify-center gap-2
                                 hover:bg-[#8127cf]/5 transition-all">
                <span className="material-symbols-outlined text-[18px]">link</span>
                Copier le lien public
              </button>
            </div>
          </div>

          {/* Vérification */}
          <div className="bg-white rounded-2xl p-6 border-2 border-[#8127cf]/10 shadow-sm">
            <h4 className="text-lg font-bold font-display text-[#0b1c30] mb-2
                           flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8127cf]">verified</span>
              Vérification
            </h4>
            <p className="text-sm text-[#7e7385] mb-1">
              ID unique :{' '}
              <span className="font-mono font-bold text-[#0b1c30]">IAAI-2026-AM-101</span>
            </p>
            <p className="text-xs text-[#7e7385] italic mb-4">
              Ce certificat est vérifiable en ligne via notre portail de sécurité.
            </p>
            <button className="w-full border border-[#cfc2d6] text-[#4d4354] py-3
                               rounded-xl font-bold text-sm
                               flex items-center justify-center gap-2
                               hover:bg-[#f0dbff]/30 transition-all">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              Vérifier ce certificat
            </button>
          </div>

        </div>
      </div>

      {/* ARIA FAB */}
      <button
        className="fixed bottom-8 right-8 text-white px-6 py-4 rounded-full
                   shadow-2xl flex items-center gap-3
                   hover:scale-105 active:scale-90 transition-all z-50 group relative"
        style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
      >
        <span className="material-symbols-outlined">chat</span>
        <span className="font-bold text-sm">ARIA</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full
                         border-2 border-white animate-pulse" />
      </button>

    </div>
  )
}