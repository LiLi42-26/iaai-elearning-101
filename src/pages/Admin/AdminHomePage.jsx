// src/pages/Admin/AdminHomePage.jsx
import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées ──────────────────────────────────────────────────────────
const kpis = [
  { icon: 'group',            label: 'Utilisateurs inscrits', value: '248',  trend: '+12', up: true,  color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
  { icon: 'school',           label: 'Modules publiés',       value: '7',    trend: null,  up: null,  color: 'text-cyan-600',   bg: 'bg-cyan-50',   border: 'border-cyan-200'   },
  { icon: 'task_alt',         label: 'Quiz complétés',        value: '1 204',trend: '+89', up: true,  color: 'text-pink-600',   bg: 'bg-pink-50',   border: 'border-pink-200'   },
  { icon: 'workspace_premium',label: 'Abonnés Illimité',      value: '31',   trend: '+5',  up: true,  color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
]

const recentUsers = [
  { name: 'Yasmine Bennani',  email: 'y.bennani@mail.ma',   plan: 'Illimité', progress: 75, joined: 'Il y a 2h',    initials: 'YB', grad: 'from-cyan-400 to-blue-500' },
  { name: 'Omar Khalil',      email: 'o.khalil@gmail.com',  plan: 'Gratuit',  progress: 40, joined: 'Il y a 5h',    initials: 'OK', grad: 'from-green-400 to-teal-500' },
  { name: 'Fatima Zahra',     email: 'f.zahra@outlook.com', plan: 'Illimité', progress: 90, joined: 'Hier',         initials: 'FZ', grad: 'from-yellow-400 to-orange-500' },
  { name: 'Mehdi Alaoui',     email: 'm.alaoui@mail.ma',    plan: 'Gratuit',  progress: 20, joined: 'Il y a 2j',    initials: 'MA', grad: 'from-violet-400 to-purple-600' },
  { name: 'Nour El Houda',    email: 'n.elhouda@mail.ma',   plan: 'Illimité', progress: 60, joined: 'Il y a 3j',    initials: 'NH', grad: 'from-pink-400 to-rose-500' },
]

const alerts = [
  { icon: 'warning',  color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', message: '3 utilisateurs n\'ont pas vérifié leur email depuis plus de 7 jours' },
  { icon: 'info',     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200',   message: 'Le Module 5 est en attente de révision avant publication' },
  { icon: 'check_circle', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', message: 'Sauvegarde Supabase automatique effectuée avec succès aujourd\'hui' },
]

const quickLinks = [
  { label: 'Gérer les utilisateurs', to: ROUTES.ADMIN_USERS,   icon: 'manage_accounts', color: 'text-violet-600', bg: 'bg-violet-50' },
  { label: 'Gérer les cours',        to: ROUTES.ADMIN_COURSES, icon: 'menu_book',        color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
  { label: 'Voir les analytics',     to: '#',                  icon: 'bar_chart',        color: 'text-pink-600',   bg: 'bg-pink-50'   },
  { label: 'Paramètres système',     to: '#',                  icon: 'settings',         color: 'text-slate-600',  bg: 'bg-slate-50'  },
]

export default function AdminHomePage() {
  return (
    <div className="min-h-screen pb-12">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-violet-950">Tableau de bord Admin</h1>
          <p className="text-slate-500 mt-1">Vue d'ensemble de la plateforme IAAI eLearning 101</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-xl">
          <span className="material-symbols-outlined text-[18px]">schedule</span>
          Mis à jour : {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* ── KPIs ─────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {kpis.map(k => (
          <div key={k.label} className={`bg-white rounded-2xl border ${k.border} p-6 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${k.bg} flex items-center justify-center`}>
                <span className={`material-symbols-outlined text-[22px] ${k.color}`}>{k.icon}</span>
              </div>
              {k.trend && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${k.up ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  {k.up ? '↑' : '↓'} {k.trend}
                </span>
              )}
            </div>
            <p className="text-2xl font-bold text-slate-800 mb-1">{k.value}</p>
            <p className="text-sm text-slate-500">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Colonne principale ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Derniers utilisateurs */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-800">Derniers inscrits</h2>
              <Link to={ROUTES.ADMIN_USERS} className="text-xs text-violet-600 font-medium hover:underline flex items-center gap-1">
                Voir tout
                <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {recentUsers.map(u => (
                <div key={u.email} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${u.grad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {u.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{u.name}</p>
                    <p className="text-xs text-slate-400 truncate">{u.email}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      u.plan === 'Illimité' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {u.plan}
                    </span>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-700">{u.progress}%</p>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1">
                        <div className="h-full rounded-full bg-violet-500" style={{ width: `${u.progress}%` }} />
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 w-20 text-right">{u.joined}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">Alertes système</h2>
            <div className="space-y-3">
              {alerts.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${a.border} ${a.bg}`}>
                  <span className={`material-symbols-outlined text-[20px] shrink-0 ${a.color}`}>{a.icon}</span>
                  <p className="text-sm text-slate-700">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Sidebar ────────────────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Accès rapides */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">Accès rapides</h2>
            <div className="space-y-2">
              {quickLinks.map(l => (
                <Link key={l.label} to={l.to} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className={`w-9 h-9 rounded-lg ${l.bg} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined text-[20px] ${l.color}`}>{l.icon}</span>
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-violet-700">{l.label}</span>
                  <span className="material-symbols-outlined text-slate-300 text-[16px] ml-auto group-hover:text-violet-400">arrow_forward</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Supabase status */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4">Statut Supabase</h2>
            <div className="space-y-3">
              {[
                { label: 'Base de données',  status: 'Opérationnelle', ok: true  },
                { label: 'Authentification', status: 'Opérationnelle', ok: true  },
                { label: 'Storage',          status: 'Non configuré',  ok: false },
                { label: 'Edge Functions',   status: 'Non activé',     ok: false },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{s.label}</span>
                  <span className={`flex items-center gap-1 text-xs font-medium ${s.ok ? 'text-green-600' : 'text-slate-400'}`}>
                    <span className={`w-2 h-2 rounded-full ${s.ok ? 'bg-green-500' : 'bg-slate-300'}`} />
                    {s.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
