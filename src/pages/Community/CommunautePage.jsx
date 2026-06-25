// src/pages/Community/CommunautePage.jsx
import { useState } from 'react'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées ──────────────────────────────────────────────────────────
const categories = ['Tous', 'Questions', 'Projets', 'Ressources', 'Annonces']

const posts = [
  {
    id: 1,
    category: 'Questions',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    author: 'Yasmine B.',
    initials: 'YB',
    avatarGrad: 'from-cyan-400 to-blue-500',
    time: 'Il y a 2 heures',
    title: 'Comment fonctionne le backpropagation en deep learning ?',
    body: "J'essaie de comprendre l'intuition derrière la rétropropagation. Est-ce que quelqu'un peut expliquer avec un exemple simple ? J'ai regardé plusieurs vidéos mais ça reste flou.",
    likes: 14,
    comments: 7,
    views: 98,
    pinned: false,
    liked: false,
  },
  {
    id: 2,
    category: 'Annonces',
    categoryColor: 'bg-pink-100 text-pink-700',
    author: 'IAAI Academy',
    initials: 'IA',
    avatarGrad: 'from-pink-500 to-violet-600',
    time: 'Hier, 10:00',
    title: '🎉 Module 4 — Réseaux de neurones disponible dès maintenant !',
    body: 'Nous avons le plaisir d\'annoncer la mise en ligne du Module 4. Au programme : perceptrons, fonctions d\'activation, et votre premier réseau de neurones en Python. Bonne exploration !',
    likes: 52,
    comments: 19,
    views: 341,
    pinned: true,
    liked: true,
  },
  {
    id: 3,
    category: 'Projets',
    categoryColor: 'bg-violet-100 text-violet-700',
    author: 'Mehdi A.',
    initials: 'MA',
    avatarGrad: 'from-violet-400 to-purple-600',
    time: 'Il y a 2 jours',
    title: 'Mon premier classificateur d\'images — retour d\'expérience 🚀',
    body: 'J\'ai terminé le projet final du module 3 ! J\'ai construit un classificateur qui distingue chats et chiens avec 89% de précision. Je partage mon notebook Jupyter si ça intéresse.',
    likes: 31,
    comments: 12,
    views: 187,
    pinned: false,
    liked: false,
  },
  {
    id: 4,
    category: 'Ressources',
    categoryColor: 'bg-yellow-100 text-yellow-700',
    author: 'Fatima Z.',
    initials: 'FZ',
    avatarGrad: 'from-yellow-400 to-orange-500',
    time: 'Il y a 3 jours',
    title: '📚 Liste de ressources gratuites pour apprendre l\'IA en 2026',
    body: 'Je compile une liste des meilleures ressources gratuites : papers, datasets, cours en ligne, chaînes YouTube... La liste est déjà à 40+ liens. Dites-moi si vous avez des suggestions !',
    likes: 67,
    comments: 24,
    views: 512,
    pinned: false,
    liked: false,
  },
  {
    id: 5,
    category: 'Questions',
    categoryColor: 'bg-cyan-100 text-cyan-700',
    author: 'Omar K.',
    initials: 'OK',
    avatarGrad: 'from-green-400 to-cyan-500',
    time: 'Il y a 4 jours',
    title: 'Différence entre overfitting et underfitting — exemple concret ?',
    body: 'Je sais la définition théorique mais j\'ai du mal à reconnaître ces problèmes dans la pratique. Y\'a-t-il une règle simple pour les détecter lors de l\'entraînement ?',
    likes: 8,
    comments: 5,
    views: 74,
    pinned: false,
    liked: false,
  },
]

const members = [
  { name: 'Yasmine B.',   initials: 'YB', grad: 'from-cyan-400 to-blue-500',    posts: 23, badge: 'Top contributeur' },
  { name: 'Mehdi A.',     initials: 'MA', grad: 'from-violet-400 to-purple-600', posts: 18, badge: 'Actif ce mois'    },
  { name: 'Fatima Z.',    initials: 'FZ', grad: 'from-yellow-400 to-orange-500', posts: 15, badge: 'Mentor'           },
  { name: 'Karim S.',     initials: 'KS', grad: 'from-pink-400 to-rose-500',     posts: 12, badge: null               },
  { name: 'Nour El H.',   initials: 'NH', grad: 'from-green-400 to-teal-500',    posts: 9,  badge: null               },
]

// ─── Composant PostCard ───────────────────────────────────────────────────────
function PostCard({ post }) {
  const [liked, setLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1)
  }

  return (
    <article className="bg-white rounded-2xl border border-[#ded6f3] p-6 hover:shadow-md hover:border-[#8127cf]/30 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${post.avatarGrad} flex items-center justify-center text-white text-sm font-bold shrink-0`}>
            {post.initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#17132f]">{post.author}</span>
              {post.pinned && (
                <span className="flex items-center gap-1 text-xs text-[#8127cf] bg-[#f0dbff] px-2 py-0.5 rounded-full">
                  <span className="material-symbols-outlined text-[12px]">push_pin</span>
                  Épinglé
                </span>
              )}
            </div>
            <span className="text-xs text-[#68627a]">{post.time}</span>
          </div>
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${post.categoryColor}`}>
          {post.category}
        </span>
      </div>

      {/* Content */}
      <h3 className="text-base font-bold text-[#17132f] mb-2 group-hover:text-[#8127cf] transition-colors cursor-pointer">
        {post.title}
      </h3>
      <p className="text-sm text-[#68627a] leading-relaxed line-clamp-2 mb-4">
        {post.body}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-5 text-sm text-[#68627a]">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 transition-colors hover:text-pink-600 ${liked ? 'text-pink-600' : ''}`}
        >
          <span className="material-symbols-outlined text-[18px]">{liked ? 'favorite' : 'favorite_border'}</span>
          <span className="font-medium">{likeCount}</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-[#8127cf] transition-colors">
          <span className="material-symbols-outlined text-[18px]">chat_bubble_outline</span>
          <span className="font-medium">{post.comments}</span>
        </button>
        <div className="flex items-center gap-1.5 ml-auto">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          <span>{post.views}</span>
        </div>
      </div>
    </article>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function CommunautePage() {
  const [activeCategory, setActiveCategory] = useState('Tous')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const filtered = posts.filter(p => {
    const matchCat = activeCategory === 'Tous' || p.category === activeCategory
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                        p.body.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const pinned = filtered.filter(p => p.pinned)
  const regular = filtered.filter(p => !p.pinned)

  return (
    <div className="min-h-screen bg-[#f8f5ff] pb-12">

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-display text-[#0b1c30]">Communauté</h2>
          <p className="text-[#68627a] mt-1">Échangez, partagez et apprenez ensemble</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm
                     hover:shadow-lg hover:shadow-[#8127cf]/20 hover:scale-105 active:scale-95 transition-all"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
        >
          <span className="material-symbols-outlined text-[18px]">edit</span>
          Nouvelle discussion
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Colonne principale ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Barre de recherche + filtres */}
          <div className="bg-white rounded-2xl border border-[#ded6f3] p-4">
            <div className="relative mb-4">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#68627a] text-[20px]">
                search
              </span>
              <input
                type="text"
                placeholder="Rechercher dans la communauté..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm
                           focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20 transition-all"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-[#8127cf] text-white shadow-sm'
                      : 'bg-[#f0dbff] text-[#8127cf] hover:bg-[#8127cf]/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Stats rapides */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: 'forum',    value: posts.length,                        label: 'Discussions' },
              { icon: 'group',    value: '142',                               label: 'Membres actifs' },
              { icon: 'trending_up', value: posts.reduce((a,p)=>a+p.comments,0), label: 'Réponses' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl border border-[#ded6f3] p-4 text-center">
                <span className="material-symbols-outlined text-[#8127cf] text-[24px] mb-1">{s.icon}</span>
                <p className="text-xl font-bold text-[#17132f]">{s.value}</p>
                <p className="text-xs text-[#68627a]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Posts épinglés */}
          {pinned.length > 0 && (
            <div className="space-y-3">
              {pinned.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          )}

          {/* Posts normaux */}
          {regular.length > 0 ? (
            <div className="space-y-3">
              {regular.map(post => <PostCard key={post.id} post={post} />)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#ded6f3] p-12 text-center">
              <span className="material-symbols-outlined text-[#cfc2d6] text-[48px] mb-3">forum</span>
              <p className="text-[#68627a] font-medium">Aucune discussion trouvée</p>
              <p className="text-sm text-[#68627a]/70 mt-1">Essayez un autre filtre ou lancez la première !</p>
            </div>
          )}
        </div>

        {/* ── Colonne latérale ──────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Top contributeurs */}
          <div className="bg-white rounded-2xl border border-[#ded6f3] p-6">
            <h3 className="text-base font-bold text-[#17132f] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-500 text-[20px]">emoji_events</span>
              Top contributeurs
            </h3>
            <div className="space-y-3">
              {members.map((m, i) => (
                <div key={m.name} className="flex items-center gap-3">
                  <span className="w-5 text-xs font-bold text-[#68627a] text-center">{i + 1}</span>
                  <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${m.grad} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                    {m.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#17132f] truncate">{m.name}</p>
                    {m.badge && (
                      <span className="text-xs text-[#8127cf] bg-[#f0dbff] px-2 py-0.5 rounded-full">{m.badge}</span>
                    )}
                  </div>
                  <span className="text-xs text-[#68627a]">{m.posts} posts</span>
                </div>
              ))}
            </div>
          </div>

          {/* Règles de la communauté */}
          <div className="bg-white rounded-2xl border border-[#ded6f3] p-6">
            <h3 className="text-base font-bold text-[#17132f] mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#8127cf] text-[20px]">gavel</span>
              Règles de la communauté
            </h3>
            <ul className="space-y-2.5">
              {[
                'Soyez respectueux et bienveillants',
                'Partagez uniquement des contenus pertinents',
                'Citez vos sources et ressources',
                'Pas de spam ni de publicité',
                'Aidez avant de demander',
              ].map((rule, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-[#68627a]">
                  <span className="w-5 h-5 rounded-full bg-[#f0dbff] text-[#8127cf] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          </div>

          {/* ARIA suggestion */}
          <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #8127cf 0%, #0891b2 100%)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span>
              <span className="font-bold text-sm">ARIA vous suggère</span>
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Basé sur votre progression au Module 3, la discussion sur le backpropagation pourrait vous être très utile !
            </p>
          </div>
        </div>
      </div>

      {/* ── Modal nouvelle discussion ─────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-display text-[#17132f]">Nouvelle discussion</h3>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-full hover:bg-[#f0dbff] flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[#68627a] text-[18px]">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#17132f] mb-1.5">Catégorie</label>
                <select className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20">
                  {categories.filter(c => c !== 'Tous').map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#17132f] mb-1.5">Titre</label>
                <input
                  type="text"
                  placeholder="Posez une question claire et précise..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#17132f] mb-1.5">Contenu</label>
                <textarea
                  rows={5}
                  placeholder="Décrivez votre question ou partagez vos connaissances..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ded6f3] text-sm focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#ded6f3] text-[#68627a] text-sm font-medium hover:bg-[#f8f5ff] transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 rounded-xl text-white text-sm font-bold hover:shadow-lg hover:shadow-[#8127cf]/20 transition-all"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
              >
                Publier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
