// src/pages/Settings/SettingsPage.jsx
import { useState } from 'react'
import { useAuthStore } from '@/store/authStore'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// ─── Sections de navigation ───────────────────────────────────────────────────
const sections = [
  { id: 'compte',         label: 'Compte',           icon: 'manage_accounts' },
  { id: 'notifications',  label: 'Notifications',    icon: 'notifications' },
  { id: 'confidentialite',label: 'Confidentialité',  icon: 'lock' },
  { id: 'langue',         label: 'Langue & Région',  icon: 'language' },
  { id: 'danger',         label: 'Zone de danger',   icon: 'warning', danger: true },
]

// ─── Toggle component ─────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-[#8127cf]' : 'bg-[#ded6f3]'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${checked ? 'translate-x-5' : ''}`} />
    </button>
  )
}

// ─── Composant de section ─────────────────────────────────────────────────────
function Section({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ded6f3] p-6 mb-5">
      <div className="mb-5 pb-4 border-b border-[#f0dbff]">
        <h3 className="text-lg font-bold text-[#17132f]">{title}</h3>
        {subtitle && <p className="text-sm text-[#68627a] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function SettingsPage() {
  const { user } = useAuthStore()
  const [activeSection, setActiveSection] = useState('compte')
  const [saved, setSaved] = useState(false)

  // États notifications
  const [notifs, setNotifs] = useState({
    email_cours:      true,
    email_community:  false,
    email_badge:      true,
    email_promo:      false,
    push_rappel:      true,
    push_reponse:     true,
  })

  // États confidentialité
  const [priv, setPriv] = useState({
    profil_public: true,
    progression_visible: false,
    badges_visibles: true,
  })

  const [langue, setLangue] = useState('fr')

  const fullName = user?.fullName || 'Ahmed M.'
  const email = user?.email || 'ahmed.m@exemple.ma'
  const initials = fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const updateNotif = (key, val) => setNotifs(prev => ({ ...prev, [key]: val }))
  const updatePriv  = (key, val) => setPriv(prev => ({ ...prev, [key]: val }))

  return (
    <div className="min-h-screen bg-[#f8f5ff] pb-12">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold font-display text-[#0b1c30]">Paramètres</h2>
        <p className="text-[#68627a] mt-1">Gérez votre compte et vos préférences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* ── Navigation latérale ───────────────────────────────────────────── */}
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#ded6f3] p-3 sticky top-6">
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-colors mb-1 ${
                  activeSection === s.id
                    ? s.danger ? 'bg-red-50 text-red-600' : 'bg-[#f0dbff] text-[#8127cf]'
                    : s.danger ? 'text-red-500 hover:bg-red-50' : 'text-[#4d4354] hover:bg-[#f8f5ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </aside>

        {/* ── Contenu principal ─────────────────────────────────────────────── */}
        <main className="lg:col-span-3">

          {/* === COMPTE === */}
          {activeSection === 'compte' && (
            <>
              <Section title="Informations personnelles" subtitle="Modifiez vos informations de profil">
                <div className="flex items-center gap-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                         style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
                      {initials}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border border-[#cfc2d6] flex items-center justify-center shadow-sm hover:bg-[#f0dbff] transition-colors">
                      <span className="material-symbols-outlined text-[#8127cf] text-[14px]">edit</span>
                    </button>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#17132f]">{fullName}</p>
                    <p className="text-xs text-[#68627a]">Photo de profil</p>
                    <button className="mt-1.5 text-xs text-[#8127cf] font-medium hover:underline">Changer la photo</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#17132f] mb-1.5">Prénom</label>
                    <input defaultValue={fullName.split(' ')[0]} className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#17132f] mb-1.5">Nom</label>
                    <input defaultValue={fullName.split(' ')[1] || ''} className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#17132f] mb-1.5">Email</label>
                    <input defaultValue={email} type="email" className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-[#17132f] mb-1.5">Bio</label>
                    <textarea rows={3} placeholder="Parlez de vous en quelques mots..." className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20 resize-none" />
                  </div>
                </div>
              </Section>

              <Section title="Sécurité" subtitle="Modifiez votre mot de passe">
                <div className="space-y-4">
                  {[
                    { label: 'Mot de passe actuel', placeholder: '••••••••••' },
                    { label: 'Nouveau mot de passe', placeholder: '8 caractères minimum' },
                    { label: 'Confirmer le mot de passe', placeholder: 'Répétez le mot de passe' },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-sm font-semibold text-[#17132f] mb-1.5">{f.label}</label>
                      <input type="password" placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20" />
                    </div>
                  ))}
                </div>
              </Section>

              <div className="flex items-center justify-end gap-3">
                {saved && (
                  <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Modifications enregistrées
                  </span>
                )}
                <button onClick={handleSave} className="px-8 py-3 rounded-xl text-white font-semibold text-sm hover:shadow-lg hover:shadow-[#8127cf]/20 transition-all" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}>
                  Enregistrer les modifications
                </button>
              </div>
            </>
          )}

          {/* === NOTIFICATIONS === */}
          {activeSection === 'notifications' && (
            <Section title="Préférences de notifications" subtitle="Choisissez ce que vous souhaitez recevoir">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-[#8127cf] mb-3">Notifications par email</p>
                {[
                  { key: 'email_cours',     label: 'Nouveau cours ou module disponible', desc: 'Recevez un email quand du nouveau contenu est publié' },
                  { key: 'email_community', label: 'Réponses dans la communauté',        desc: 'Quand quelqu\'un répond à votre discussion' },
                  { key: 'email_badge',     label: 'Badges et récompenses',              desc: 'Quand vous obtenez un nouveau badge' },
                  { key: 'email_promo',     label: 'Offres promotionnelles',             desc: 'Réductions et offres spéciales' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-[#f0dbff] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[#17132f]">{n.label}</p>
                      <p className="text-xs text-[#68627a]">{n.desc}</p>
                    </div>
                    <Toggle checked={notifs[n.key]} onChange={v => updateNotif(n.key, v)} />
                  </div>
                ))}
                <p className="text-xs font-bold uppercase tracking-wider text-[#8127cf] mt-5 mb-3">Notifications push</p>
                {[
                  { key: 'push_rappel', label: 'Rappels d\'étude',       desc: 'Rappel quotidien pour maintenir votre progression' },
                  { key: 'push_reponse', label: 'Réponses immédiates',   desc: 'Notification instantanée de nouvelles réponses' },
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between py-4 border-b border-[#f0dbff] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[#17132f]">{n.label}</p>
                      <p className="text-xs text-[#68627a]">{n.desc}</p>
                    </div>
                    <Toggle checked={notifs[n.key]} onChange={v => updateNotif(n.key, v)} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* === CONFIDENTIALITÉ === */}
          {activeSection === 'confidentialite' && (
            <Section title="Confidentialité" subtitle="Contrôlez la visibilité de votre profil">
              <div className="space-y-1">
                {[
                  { key: 'profil_public',       label: 'Profil public',              desc: 'Votre profil est visible par les autres membres' },
                  { key: 'progression_visible',  label: 'Progression visible',        desc: 'Les autres peuvent voir votre avancement dans les cours' },
                  { key: 'badges_visibles',      label: 'Badges affichés',            desc: 'Affichez vos badges sur votre profil public' },
                ].map(p => (
                  <div key={p.key} className="flex items-center justify-between py-4 border-b border-[#f0dbff] last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-[#17132f]">{p.label}</p>
                      <p className="text-xs text-[#68627a]">{p.desc}</p>
                    </div>
                    <Toggle checked={priv[p.key]} onChange={v => updatePriv(p.key, v)} />
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* === LANGUE === */}
          {activeSection === 'langue' && (
            <Section title="Langue & Région" subtitle="Choisissez la langue d'affichage de la plateforme">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[#17132f] mb-2">Langue de la plateforme</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { code: 'fr', label: 'Français', flag: '🇫🇷' },
                      { code: 'ar', label: 'العربية',   flag: '🇲🇦' },
                    ].map(l => (
                      <button
                        key={l.code}
                        onClick={() => setLangue(l.code)}
                        className={`flex items-center gap-3 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                          langue === l.code
                            ? 'border-[#8127cf] bg-[#f0dbff]'
                            : 'border-[#ded6f3] hover:border-[#8127cf]/50'
                        }`}
                      >
                        <span className="text-2xl">{l.flag}</span>
                        <div>
                          <p className="text-sm font-semibold text-[#17132f]">{l.label}</p>
                          <p className="text-xs text-[#68627a]">{l.code === 'ar' ? 'RTL supporté' : 'Langue par défaut'}</p>
                        </div>
                        {langue === l.code && (
                          <span className="material-symbols-outlined text-[#8127cf] text-[20px] ml-auto">check_circle</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-[#f0dbff]/50 rounded-xl p-4 flex items-start gap-3">
                  <span className="material-symbols-outlined text-[#8127cf] text-[20px] shrink-0">info</span>
                  <p className="text-sm text-[#68627a]">Le changement de langue s'appliquera après rechargement de la page. Le contenu des cours reste en français et en arabe.</p>
                </div>
              </div>
            </Section>
          )}

          {/* === ZONE DE DANGER === */}
          {activeSection === 'danger' && (
            <div className="bg-white rounded-2xl border-2 border-red-200 p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b border-red-100">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-red-500 text-[20px]">warning</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-600">Zone de danger</h3>
                  <p className="text-sm text-red-400">Ces actions sont irréversibles. Agissez avec précaution.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                  <div>
                    <p className="text-sm font-semibold text-[#17132f]">Exporter mes données</p>
                    <p className="text-xs text-[#68627a]">Téléchargez toutes vos données de compte et de progression</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors">
                    Exporter
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border border-red-100">
                  <div>
                    <p className="text-sm font-semibold text-red-600">Supprimer mon compte</p>
                    <p className="text-xs text-[#68627a]">Suppression définitive de tout votre contenu et progression</p>
                  </div>
                  <button className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}
