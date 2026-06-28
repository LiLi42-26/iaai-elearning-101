// src/pages/Admin/AdminCoursesPage.jsx
// But : permettre à l'admin de visualiser et gérer tous les modules du cours.
// Données réelles depuis Supabase : modules + count leçons + count quiz.

import { useState, useEffect } from 'react'
import { supabase } from '@/services/supabaseClient'

// ─── Couleurs par ordre_index ─────────────────────────────────────────────────
const MODULE_COLORS = [
  'bg-violet-500', 'bg-cyan-500', 'bg-pink-500',
  'bg-yellow-500', 'bg-green-500', 'bg-orange-500', 'bg-rose-500',
]

const statusStyles = {
  true:  'bg-green-100 text-green-700',
  false: 'bg-yellow-100 text-yellow-700',
}

const statusLabels = {
  true:  'Publié',
  false: 'Brouillon',
}

const statusIcons = {
  true:  'public',
  false: 'edit_note',
}

// ─── Skeleton ────────────────────────────────────────────────────────────────
function CourseSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-64 bg-slate-200 rounded" />
              <div className="h-3 w-40 bg-slate-100 rounded" />
            </div>
            <div className="h-6 w-20 bg-slate-100 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminCoursesPage() {
  const [modules,      setModules]      = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)
  const [search,       setSearch]       = useState('')
  const [filterStatus, setFilterStatus] = useState('Tous')
  const [editModal,    setEditModal]    = useState(null)

  // ── Charger les modules avec leurs leçons et quiz ───────────────────────────
  useEffect(() => {
    fetchModules()
  }, [])

  async function fetchModules() {
    setLoading(true)
    setError(null)
    try {
      // 1. Tous les modules
      const { data: modulesData, error: modError } = await supabase
        .from('modules')
        .select('id, title, order_index, is_premium, created_at, updated_at')
        .order('order_index', { ascending: true })

      if (modError) throw modError

      // 2. Count leçons par module
      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('module_id')

      // 3. Count quiz par module
      const { data: quizzesData } = await supabase
        .from('quizzes')
        .select('module_id')

      // 4. Count apprenants ayant commencé chaque module (user_progress)
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('module_id, user_id')

      // ── Construire les stats par module ──────────────────────────────────────
      const lessonsByModule  = {}
      const quizzesByModule  = {}
      const enrolledByModule = {}

      ;(lessonsData  || []).forEach(l => { lessonsByModule[l.module_id]  = (lessonsByModule[l.module_id]  || 0) + 1 })
      ;(quizzesData  || []).forEach(q => { quizzesByModule[q.module_id]  = (quizzesByModule[q.module_id]  || 0) + 1 })
      // Apprenants uniques par module
      const enrolledSets = {}
      ;(progressData || []).forEach(p => {
        if (!enrolledSets[p.module_id]) enrolledSets[p.module_id] = new Set()
        enrolledSets[p.module_id].add(p.user_id)
      })
      Object.keys(enrolledSets).forEach(mid => {
        enrolledByModule[mid] = enrolledSets[mid].size
      })

      const enriched = (modulesData || []).map((mod, idx) => ({
        ...mod,
        lessons:   lessonsByModule[mod.id]  || 0,
        quizzes:   quizzesByModule[mod.id]  || 0,
        enrolled:  enrolledByModule[mod.id] || 0,
        color:     MODULE_COLORS[idx % MODULE_COLORS.length],
        updatedAt: mod.updated_at
          ? new Date(mod.updated_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
          : '—',
      }))

      setModules(enriched)
    } catch (err) {
      console.error('[AdminCoursesPage]', err)
      setError('Impossible de charger les modules.')
    } finally {
      setLoading(false)
    }
  }

  // ── Filtres ──────────────────────────────────────────────────────────────────
  const filtered = modules.filter(m => {
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus =
      filterStatus === 'Tous'      ? true :
      filterStatus === 'Publié'    ? !m.is_premium || true  // tous les publiés
                                   : false
    // Filtre simplifié : Publié = module existant, Brouillon = is_premium non défini
    const statusMatch =
      filterStatus === 'Tous'    ? true :
      filterStatus === 'Publié'  ? true :   // tous les modules en base sont publiés
      false
    return matchSearch && statusMatch
  })

  // ── KPIs calculés depuis les vraies données ──────────────────────────────────
  const totalLessons = modules.reduce((a, m) => a + m.lessons, 0)
  const totalQuizzes = modules.reduce((a, m) => a + m.quizzes, 0)

  return (
    <div className="min-h-screen pb-12">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-violet-950">Gestion des cours</h1>
          <p className="text-slate-500 mt-1">
            {loading ? '…' : `${modules.length} modules · ${totalLessons} leçons au total`}
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Nouveau module
        </button>
      </div>

      {/* ── KPIs ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Modules total',   value: modules.length, icon: 'menu_book',   color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Publiés',         value: modules.length, icon: 'public',      color: 'text-green-600',  bg: 'bg-green-50'  },
          { label: 'Leçons totales',  value: totalLessons,   icon: 'play_circle', color: 'text-cyan-600',   bg: 'bg-cyan-50'   },
          { label: 'Quiz configurés', value: totalQuizzes,   icon: 'quiz',        color: 'text-pink-600',   bg: 'bg-pink-50'   },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className={`w-9 h-9 rounded-xl ${k.bg} flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined text-[20px] ${k.color}`}>{k.icon}</span>
            </div>
            <p className="text-2xl font-bold text-slate-800">
              {loading ? <span className="animate-pulse">…</span> : k.value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      {/* ── Filtres ─────────────────────────────────────────────────────────── */}
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
        {['Tous', 'Publié'].map(s => (
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
        <button
          onClick={fetchModules}
          className="px-4 py-2 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Actualiser
        </button>
      </div>

      {/* ── Erreur ──────────────────────────────────────────────────────────── */}
      {error && (
        <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
          <span className="material-symbols-outlined text-red-500 text-[20px]">error</span>
          <p className="text-sm text-red-700">{error}</p>
          <button onClick={fetchModules} className="ml-auto text-xs text-red-600 font-medium hover:underline">Réessayer</button>
        </div>
      )}

      {/* ── Liste des modules ─────────────────────────────────────────────── */}
      {loading ? <CourseSkeleton /> : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-sm transition-shadow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                {/* Numéro + couleur */}
                <div className={`w-12 h-12 rounded-xl ${m.color} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                  {m.order_index}
                </div>

                {/* Info principale */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-slate-800">{m.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1 ${statusStyles[true]}`}>
                      <span className="material-symbols-outlined text-[12px]">{statusIcons[true]}</span>
                      {statusLabels[true]}
                    </span>
                    {m.is_premium && (
                      <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[12px]">workspace_premium</span>
                        Premium
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">play_circle</span>
                      {m.lessons} leçon{m.lessons !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">quiz</span>
                      {m.quizzes} quiz
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">group</span>
                      {m.enrolled} apprenant{m.enrolled !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">update</span>
                      MàJ : {m.updatedAt}
                    </span>
                  </div>
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
                  <button className="w-8 h-8 rounded-xl hover:bg-red-50 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-[16px] text-red-400">delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
              <span className="material-symbols-outlined text-slate-300 text-[48px] mb-3">menu_book</span>
              <p className="text-slate-400">Aucun module trouvé</p>
            </div>
          )}
        </div>
      )}

      {/* ── Modal édition ─────────────────────────────────────────────────── */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-slate-800">Module {editModal.order_index} — {editModal.title}</h3>
              <button onClick={() => setEditModal(null)} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">close</span>
              </button>
            </div>

            {/* Stats du module */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Leçons',     value: editModal.lessons  },
                { label: 'Quiz',       value: editModal.quizzes  },
                { label: 'Apprenants', value: editModal.enrolled },
              ].map(d => (
                <div key={d.label} className="bg-slate-50 rounded-xl p-3 text-center">
                  <p className="text-xl font-bold text-slate-800">{d.value}</p>
                  <p className="text-xs text-slate-400">{d.label}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Titre du module</label>
                <input
                  defaultValue={editModal.title}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description courte</label>
                <textarea
                  rows={3}
                  defaultValue={editModal.description || ''}
                  placeholder="Description du module..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setEditModal(null)}
                className="flex-1 py-3 rounded-xl bg-violet-700 text-white text-sm font-semibold hover:bg-violet-800 transition-colors"
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}