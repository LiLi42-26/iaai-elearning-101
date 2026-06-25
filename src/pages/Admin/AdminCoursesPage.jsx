// src/pages/Admin/AdminCoursesPage.jsx
import { useState } from 'react'

const modulesData = [
  { id: 1, title: "Qu'est-ce que l'IA ?",                    lessons: 6,  quizzes: 1, status: 'Publié',   progress: 100, updatedAt: '10 jan. 2026', enrolled: 248, color: 'bg-violet-500' },
  { id: 2, title: 'Comment les ordinateurs décident',        lessons: 5,  quizzes: 1, status: 'Publié',   progress: 100, updatedAt: '15 jan. 2026', enrolled: 231, color: 'bg-cyan-500'   },
  { id: 3, title: 'Concepts de programmation Python',        lessons: 7,  quizzes: 2, status: 'Publié',   progress: 100, updatedAt: '20 jan. 2026', enrolled: 198, color: 'bg-pink-500'   },
  { id: 4, title: 'Réseaux de neurones — Introduction',      lessons: 8,  quizzes: 2, status: 'Publié',   progress: 100, updatedAt: '01 fév. 2026', enrolled: 156, color: 'bg-yellow-500' },
  { id: 5, title: 'Machine Learning supervisé',              lessons: 9,  quizzes: 2, status: 'Brouillon',progress: 70,  updatedAt: '15 mar. 2026', enrolled: 0,   color: 'bg-green-500'  },
  { id: 6, title: 'Deep Learning & Vision par ordinateur',   lessons: 10, quizzes: 3, status: 'Brouillon',progress: 30,  updatedAt: '20 mar. 2026', enrolled: 0,   color: 'bg-orange-500' },
  { id: 7, title: 'LLMs & IA Générative',                   lessons: 8,  quizzes: 2, status: 'À venir',  progress: 10,  updatedAt: '—',            enrolled: 0,   color: 'bg-rose-500'   },
]

const statusStyles = {
  'Publié':   'bg-green-100 text-green-700',
  'Brouillon':'bg-yellow-100 text-yellow-700',
  'À venir':  'bg-slate-100 text-slate-500',
}

const statusIcons = {
  'Publié':   'public',
  'Brouillon':'edit_note',
  'À venir':  'lock_clock',
}

export default function AdminCoursesPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('Tous')
  const [editModal, setEditModal] = useState(null)

  const filtered = modulesData.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'Tous' || m.status === filterStatus
    return matchSearch && matchStatus
  })

  const totalLessons  = modulesData.reduce((a, m) => a + m.lessons, 0)
  const totalPublished = modulesData.filter(m => m.status === 'Publié').length

  return (
    <div className="min-h-screen pb-12">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-violet-950">Gestion des cours</h1>
          <p className="text-slate-500 mt-1">
            {totalPublished} modules publiés · {totalLessons} leçons au total
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nouveau module
        </button>
      </div>

      {/* ── KPIs rapides ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Modules total',    value: modulesData.length,  icon: 'menu_book',    color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Publiés',          value: totalPublished,       icon: 'public',       color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Leçons totales',   value: totalLessons,         icon: 'play_circle',  color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
          { label: 'Quiz configurés',  value: modulesData.reduce((a,m)=>a+m.quizzes,0), icon: 'quiz', color: 'text-pink-600', bg: 'bg-pink-50' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined text-[20px] ${k.color}`}>{k.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">{k.value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filtres ───────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un module..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
          />
        </div>
        {['Tous', 'Publié', 'Brouillon', 'À venir'].map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filterStatus === s ? 'bg-violet-700 text-white' : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Liste des modules ─────────────────────────────────────────────────── */}
      <div className="space-y-3">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">

              {/* Numéro + couleur */}
              <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                {m.id}
              </div>

              {/* Info principale */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-slate-800">{m.title}</h3>
                  <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusStyles[m.status]}`}>
                    <span className="material-symbols-outlined text-[12px]">{statusIcons[m.status]}</span>
                    {m.status}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">play_circle</span>
                    {m.lessons} leçons
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">quiz</span>
                    {m.quizzes} quiz
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">group</span>
                    {m.enrolled} inscrits
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">update</span>
                    MàJ : {m.updatedAt}
                  </span>
                </div>

                {/* Barre de complétion du module */}
                {m.status !== 'Publié' && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${m.status === 'Brouillon' ? 'bg-yellow-400' : 'bg-slate-300'}`}
                        style={{ width: `${m.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">{m.progress}% complété</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setEditModal(m)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-violet-200 text-violet-600 text-xs font-medium hover:bg-violet-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  Modifier
                </button>
                {m.status === 'Brouillon' && (
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors">
                    <span className="material-symbols-outlined text-[15px]">public</span>
                    Publier
                  </button>
                )}
                <button className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center transition-colors">
                  <span className="material-symbols-outlined text-[16px] text-red-400">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
            <span className="material-symbols-outlined text-slate-300 text-[48px] mb-3">menu_book</span>
            <p className="text-slate-400">Aucun module trouvé</p>
          </div>
        )}
      </div>

      {/* ── Modal édition ─────────────────────────────────────────────────────── */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Modifier le module {editModal.id}</h3>
              <button onClick={() => setEditModal(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre du module</label>
                <input defaultValue={editModal.title} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Statut</label>
                  <select defaultValue={editModal.status} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400">
                    <option>Publié</option>
                    <option>Brouillon</option>
                    <option>À venir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre de leçons</label>
                  <input type="number" defaultValue={editModal.lessons} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description courte</label>
                <textarea rows={3} placeholder="Description du module..." className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setEditModal(null)} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                Annuler
              </button>
              <button onClick={() => setEditModal(null)} className="flex-1 py-3 rounded-xl bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors">
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
