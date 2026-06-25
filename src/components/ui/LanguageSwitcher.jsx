// src/components/ui/LanguageSwitcher.jsx
import { useLanguage } from '@/hooks/useLanguage'

/**
 * LanguageSwitcher — bouton compact FR ↔ AR.
 *
 * Props :
 *   variant: 'pill' (défaut, pour la navbar) | 'full' (pour les Paramètres)
 */
export default function LanguageSwitcher({ variant = 'pill' }) {
  const { language, switchLanguage } = useLanguage()

  if (variant === 'full') {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => switchLanguage('fr')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
            language === 'fr'
              ? 'bg-[#f0dbff] text-[#8127cf] border-[#8127cf]/30'
              : 'text-[#4d4354] border-[#e8e0f0] hover:bg-[#f0dbff]/50'
          }`}
        >
          <span className="text-base">🇫🇷</span>
          Français
        </button>
        <button
          onClick={() => switchLanguage('ar')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border transition-colors ${
            language === 'ar'
              ? 'bg-[#f0dbff] text-[#8127cf] border-[#8127cf]/30'
              : 'text-[#4d4354] border-[#e8e0f0] hover:bg-[#f0dbff]/50'
          }`}
        >
          <span className="text-base">🇲🇦</span>
          العربية
        </button>
      </div>
    )
  }

  // variant === 'pill'
  return (
    <button
      onClick={() => switchLanguage(language === 'fr' ? 'ar' : 'fr')}
      title={language === 'fr' ? 'Switch to Arabic' : 'Passer en Français'}
      className="w-10 h-10 rounded-full flex items-center justify-center
                 hover:bg-white transition-colors text-xs font-bold
                 text-[#4d4354] border border-[#cfc2d6]/50 bg-white/70"
    >
      {language === 'fr' ? 'ع' : 'FR'}
    </button>
  )
}