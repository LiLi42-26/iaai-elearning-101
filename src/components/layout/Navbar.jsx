import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Flame, 
  Globe, 
  ChevronDown, 
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function Navbar({ setActivePage }) {
  const [lang, setLang] = useState('FR');
  const [showNotifications, setShowNotifications] = useState(false);

  // Quick achievements info
  const streakDays = 7;
  const xpPoints = 1450;

  return (
    <header className="h-20 bg-white/70 backdrop-blur-md border-b border-purple-50 sticky top-0 z-30 px-8 flex items-center justify-between">
      {/* Search Bar with Gradient Accent */}
      <div className="w-96 relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-pink/20 to-brand-purple/20 rounded-full blur-sm opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 group-focus-within:text-brand-purple transition-colors duration-300" />
          <input
            type="text"
            placeholder="Rechercher des cours d'IA, des modules..."
            className="w-full h-11 pl-12 pr-4 bg-purple-50/40 hover:bg-purple-50/70 focus:bg-white border border-purple-100/50 focus:border-brand-purple text-sm text-slate-800 rounded-full outline-none transition-all duration-300 shadow-inner focus:shadow-md"
          />
        </div>
      </div>

      {/* Right Side Tools & Controls */}
      <div className="flex items-center gap-6">
        {/* Moroccan Daily Streak Display */}
        <div 
          onClick={() => setActivePage('profil')}
          className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100/70 border border-amber-100 text-amber-700 rounded-full text-xs font-bold cursor-pointer transition-all duration-300 group shadow-sm"
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 group-hover:scale-125 transition-transform duration-300 animate-pulse" />
          <span>Série de {streakDays} Jours 🔥</span>
        </div>

        {/* XP Points */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-100 text-brand-purple rounded-full text-xs font-bold">
          <Sparkles className="w-4 h-4 text-brand-purple" />
          <span>{xpPoints} XP</span>
        </div>

        {/* Language Selector (FR / AR) */}
        <div className="relative">
          <button 
            onClick={() => setLang(lang === 'FR' ? 'AR' : 'FR')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl text-xs font-semibold text-slate-700 transition-all duration-300"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'FR' ? 'Français' : 'العربية'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Notifications Button with Badge */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-purple-50 hover:text-brand-purple border border-slate-200/50 flex items-center justify-center text-slate-600 transition-all duration-300 relative group"
          >
            <Bell className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-tr from-brand-pink to-brand-purple text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white shadow-sm">
              2
            </span>
          </button>

          {/* Quick Mock Notification Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl border border-purple-100 shadow-xl py-2 z-50 animate-float">
              <div className="px-4 py-2 border-b border-purple-50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800">Notifications</span>
                <span className="text-[10px] text-brand-purple font-semibold cursor-pointer">Tout marquer lu</span>
              </div>
              <div className="max-h-60 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-purple-50/50 border-b border-purple-50/30 transition-colors duration-200">
                  <p className="text-xs text-slate-700 font-medium">✨ Nouveau module disponible : Introduction à NLP en Darija !</p>
                  <span className="text-[10px] text-slate-400">Il y a 2 heures</span>
                </div>
                <div className="px-4 py-3 hover:bg-purple-50/50 transition-colors duration-200">
                  <p className="text-xs text-slate-700 font-medium">🏆 Félicitations ! Votre certificat "IA Fondations" est prêt.</p>
                  <span className="text-[10px] text-slate-400">Hier</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Center */}
        <button 
          onClick={() => setActivePage('faq')}
          className="w-10 h-10 rounded-xl bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200/50 hover:text-slate-700 transition-all duration-300"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
