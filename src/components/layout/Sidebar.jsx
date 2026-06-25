import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Award, 
  Users, 
  Settings, 
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage, plan = 'Plan Gratuit' }) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'parcours', label: 'Mon Parcours IA', icon: Map },
    { id: 'certificats', label: 'Mes Certificats', icon: Award },
    { id: 'communaute', label: 'Communauté', icon: Users },
    { id: 'parametres', label: 'Paramètres', icon: Settings },
  ];

  return (
    <aside className="w-72 h-screen fixed left-0 top-0 bg-white border-r border-purple-100 flex flex-col justify-between z-40 moroccan-pattern">
      {/* Brand Header */}
      <div>
        <div className="p-6 flex items-center gap-3 border-b border-purple-50">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center text-white shadow-md shadow-purple-200 animate-float">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-brand-pink to-brand-purple bg-clip-text text-transparent tracking-tight">
              IAAI 101
            </h1>
            <p className="text-[10px] text-purple-400 font-semibold uppercase tracking-wider">
              E-Learning Maroc
            </p>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="p-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group overflow-hidden ${
                  isActive 
                    ? 'text-white shadow-md shadow-purple-100' 
                    : 'text-slate-600 hover:text-brand-purple hover:bg-purple-50/50'
                }`}
              >
                {/* Active Background Slide */}
                {isActive && (
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-pink to-brand-purple z-0" />
                )}
                
                {/* Hover Shimmer Line */}
                {!isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-purple scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-lg" />
                )}

                <Icon className={`w-5 h-5 z-10 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-brand-purple'
                }`} />
                
                <span className="z-10 relative">{item.label}</span>

                {/* Arrow hint on hover for inactive items */}
                {!isActive && (
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 text-brand-purple" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User & Plan Status Info (Bottom) */}
      <div className="p-4 border-t border-purple-50 bg-gradient-to-b from-transparent to-purple-50/30">
        <div className="bg-white rounded-2xl p-4 border border-purple-100 shadow-sm relative overflow-hidden group">
          {/* Subtle Decorative Pattern */}
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-12 h-12 rounded-full bg-brand-pink/5 group-hover:scale-150 transition-transform duration-500" />
          
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-pink-200 flex items-center justify-center font-bold text-brand-text border-2 border-purple-100 shadow-inner">
              AM
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-800">Ahmed M.</h4>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-medium text-slate-500">{plan}</span>
              </div>
            </div>
          </div>

          {/* Premium "Passer à Illimité" Button */}
          {plan !== 'Plan Illimité' && (
            <button 
              onClick={() => setActivePage('upgrade')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-brand-pink to-brand-purple hover:from-brand-purple hover:to-brand-pink text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-md shadow-purple-100 hover:shadow-lg hover:shadow-purple-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Passer à Illimité</span>
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
