// src/hooks/useLanguage.js
import { useTranslation } from 'react-i18next'

/**
 * useLanguage — hook utilitaire pour changer la langue et connaître la direction.
 *
 * Usage :
 *   const { language, isRTL, switchLanguage, toggleLanguage } = useLanguage()
 */
export function useLanguage() {
  const { i18n } = useTranslation()

  const language = i18n.language || 'fr'
  const isRTL = language === 'ar'

  const switchLanguage = (lng) => {
    i18n.changeLanguage(lng)
  }

  const toggleLanguage = () => {
    switchLanguage(isRTL ? 'fr' : 'ar')
  }

  return { language, isRTL, switchLanguage, toggleLanguage }
}