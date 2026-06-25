// src/i18n/index.js
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './locales/fr.json'
import ar from './locales/ar.json'

// ─── Appliquer la direction RTL sur le document ───────────────────────────────
function applyDirection(lng) {
  const dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.dir = dir
  document.documentElement.lang = lng
}

// ─── Langue sauvegardée (ou français par défaut) ──────────────────────────────
const savedLanguage = localStorage.getItem('iaai-language') || 'fr'

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      ar: { translation: ar },
    },
    lng: savedLanguage,
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false, // React échappe déjà les valeurs
    },
  })

// Appliquer la direction au démarrage
applyDirection(savedLanguage)

// Mettre à jour direction + localStorage à chaque changement de langue
i18n.on('languageChanged', (lng) => {
  applyDirection(lng)
  localStorage.setItem('iaai-language', lng)
})

export default i18n