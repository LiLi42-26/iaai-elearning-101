// src/pages/Admin/AdminUsersPage.jsx
import { useState } from 'react'

// ─── Données mockées ──────────────────────────────────────────────────────────
const usersData = [
  { id: 1, name: 'Yasmine Bennani',  email: 'y.bennani@mail.ma',    plan: 'Illimité', progress: 75, status: 'Actif',     joined: '15 jan. 2026', initials: 'YB', grad: 'from-cyan-400 to-blue-500',      quizzes: 6, lastSeen: 'Il y a 2h'   },
  { id: 2, name: 'Omar Khalil',      email: 'o.khalil@gmail.com',   plan: 'Gratuit',  progress: 40, status: 'Actif',     joined: '22 jan. 2026', initials: 'OK', grad: 'from-green-400 to-teal-500',     quizzes: 3, lastSeen: 'Il y a 5h'   },
  { id: 3, name: 'Fatima Zahra',     email: 'f.zahra@outlook.com',  plan: 'Illimité', progress: 90, status: 'Actif',     joined: '03 fév. 2026', initials: 'FZ', grad: 'from-yellow-400 to-orange-500',  quizzes: 7, lastSeen: 'Hier'         },
  { id: 4, name: 'Mehdi Alaoui',     email: 'm.alaoui@mail.ma',     plan: 'Gratuit',  progress: 20, status: 'Inactif',   joined: '10 fév. 2026', initials: 'MA', grad: 'from-violet-400 to-purple-600',  quizzes: 1, lastSeen: 'Il y a 8j'   },
  { id: 5, name: 'Nour El Houda',    email: 'n.elhouda@mail.ma',    plan: 'Illimité', progress: 60, status: 'Actif',     joined: '18 fév. 2026', initials: 'NH', grad: 'from-pink-400 to-rose-500',      quizzes: 5, lastSeen: 'Il y a 1j'   },
  { id: 6, name: 'Karim Saidi',      email: 'k.saidi@gmail.com',    plan: 'Gratuit',  progress: 10, status: 'En attente',joined: '01 mar. 2026', initials: 'KS', grad: 'from-red-400 to-orange-400',     quizzes: 0, lastSeen: 'Il y a 15j'  },
  { id: 7, name: 'Aya Mansouri',     email: 'a.mansouri@mail.ma',   plan: 'Illimité', progress: 55, status: 'Actif',     joined: '12 mar. 2026', initials: 'AM', grad: 'from-blue-400 to-indigo-500',    quizzes: 4, lastSeen: 'Il y a 3h'   },
  { id: 8, name: 'Hamza Berrada',    email: 'h.berrada@outlook.com',plan: 'Gratuit',  progress: 30, status: 'Actif',     joined: '20 mar. 2026', initials: 'HB', grad: 'from-teal-400 to-cyan-500',      quizzes: 2, lastSeen: 'Il y a 12h'  },
]

const statusColors = {
  'Actif':      'bg-green-100 text-green-700',
  'Inactif':    'bg-slate-100 text-slate-500',
  'En attente': 'bg-yellow-100 text-yellow-700',
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('')
  const [filterPlan, setFilterPlan] = useState('Tous')
  const [filterStatus, setFilterStatus] = useState('Tous')
  const [selected, setSelected] = useState([])
  const [viewUser, setViewUser] = useState(null)

  const filtered = usersData.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchPlan = filterPlan === 'Tous' || u.plan === filterPlan
    const matchStatus = filterStatus === 'Tous' || u.status === filterStatus
    return matchSearch && matchPlan && matchStatus
  })

  const toggleSelect = id => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id])
  const allSelected = filtered.length > 0 && filtered.every(u => selected.includes(u.id))
  const toggleAll = () => setSelected(allSelected ? [] : filtered.map(u => u.id))

  return (
    <div className="min-h-screen pb-12">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-violet-950">Utilisateurs</h1>
          <p className="text-slate-500 mt-1">{usersData.length} membres inscrits sur la plateforme</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Inviter un utilisateur
        </button>
      </div>

      {/* ── Filtres ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un utilisateur..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>
        <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400">
          <option>Tous</option>
          <option>Gratuit</option>
          <option>Illimité</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400">
          <option>Tous</option>
          <option>Actif</option>
          <option>Inactif</option>
          <option>En attente</option>
        </select>
        {selected.length > 0 && (
          <button className="px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Supprimer ({selected.length})
          </button>
        )}
      </div>

      {/* ── Tableau ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded border-slate-300 text-violet-600 focus:ring-violet-400" />
              </th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Utilisateur</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Plan</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Progression</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Statut</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Inscrit le</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Dernière activité</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(u => (
              <tr key={u.id} className={`hover:bg-slate-50 transition-colors ${selected.includes(u.id) ? 'bg-violet-50' : ''}`}>
                <td className="px-4 py-3.5">
                  <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="rounded border-slate-300 text-violet-600 focus:ring-violet-400" />
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${u.grad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {u.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${u.plan === 'Illimité' ? 'bg-violet-100 text-violet-700' : 'bg-slate-100 text-slate-600'}`}>
                    {u.plan}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-100 rounded-full">
                      <div className="h-full rounded-full bg-violet-500" style={{ width: `${u.progress}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-600">{u.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[u.status]}`}>{u.status}</span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{u.joined}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{u.lastSeen}</td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1">
                    <button onClick={() => setViewUser(u)} className="w-7 h-7 rounded-lg hover:bg-violet-100 flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-violet-600">visibility</span>
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-slate-400">edit</span>
                    </button>
                    <button className="w-7 h-7 rounded-lg hover:bg-red-100 flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[16px] text-red-400">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <span className="material-symbols-outlined text-slate-300 text-[48px] mb-3">person_search</span>
            <p className="text-slate-400">Aucun utilisateur trouvé</p>
          </div>
        )}

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <span>{filtered.length} résultat(s)</span>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">←</button>
            <span className="px-3 py-1.5 rounded-lg bg-violet-700 text-white font-medium">1</span>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">→</button>
          </div>
        </div>
      </div>

      {/* ── Modal détail utilisateur ─────────────────────────────────────────── */}
      {viewUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Profil utilisateur</h3>
              <button onClick={() => setViewUser(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">close</span>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${viewUser.grad} flex items-center justify-center text-white text-xl font-bold`}>
                {viewUser.initials}
              </div>
              <div>
                <p className="font-bold text-slate-800 text-lg">{viewUser.name}</p>
                <p className="text-sm text-slate-400">{viewUser.email}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full mt-1 inline-block ${statusColors[viewUser.status]}`}>{viewUser.status}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { label: 'Plan',         value: viewUser.plan       },
                { label: 'Progression',  value: `${viewUser.progress}%` },
                { label: 'Quiz complétés',value: `${viewUser.quizzes}/7`},
                { label: 'Inscrit le',   value: viewUser.joined     },
              ].map(d => (
                <div key={d.label} className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400 mb-0.5">{d.label}</p>
                  <p className="text-sm font-bold text-slate-700">{d.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setViewUser(null)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                Fermer
              </button>
              <button className="flex-1 py-2.5 rounded-xl bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors">
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
