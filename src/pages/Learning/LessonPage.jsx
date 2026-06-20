// src/pages/Learning/LessonPage.jsx
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées ─────────────────────────────────────────────────────────
const lessonData = {
  3: {
    title: "Les conditions",
    moduleTitle: "Module 3 — Concepts fondamentaux de programmation",
    moduleId: 3,
    lessonNumber: 3,
    totalLessons: 6,
    duration: "12:00",
    currentTime: "05:24",
    progress: 45,
    plan: [
      { title: "Introduction",   status: 'done'   },
      { title: "Les variables",  status: 'done'   },
      { title: "Les conditions", status: 'active' },
      { title: "Les boucles",    status: 'locked' },
      { title: "Les fonctions",  status: 'locked' },
      { title: "Projet Final",   status: 'locked' },
    ],
    tip: "En Python l'indentation est obligatoire. Utilisez exactement 4 espaces pour définir le bloc de code qui s'exécute après une condition.",
    code: [
      { line: 1, content: [{ text: 'temperature = ', color: '#f8f8f2' }, { text: '35', color: '#bd93f9' }] },
      { line: 2, content: [] },
      { line: 3, content: [{ text: 'if ', color: '#ff79c6' }, { text: 'temperature > ', color: '#f8f8f2' }, { text: '30', color: '#bd93f9' }, { text: ':', color: '#f8f8f2' }] },
      { line: 4, content: [{ text: '    print(', color: '#f8f8f2' }, { text: '"Il fait chaud !"', color: '#f1fa8c' }, { text: ')', color: '#f8f8f2' }] },
      { line: 5, content: [{ text: 'else', color: '#ff79c6' }, { text: ':', color: '#f8f8f2' }] },
      { line: 6, content: [{ text: '    print(', color: '#f8f8f2' }, { text: '"C\'est agréable."', color: '#f1fa8c' }, { text: ')', color: '#f8f8f2' }] },
    ],
  },
}

export default function LessonPage() {
  const { id } = useParams()
  const lesson = lessonData[id] || lessonData[3]
  const [codeExecuted, setCodeExecuted] = useState(false)

  return (
    <div className="pb-12">

      {/* ── Breadcrumb ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-6">
        <Link
          to={ROUTES.MODULE(lesson.moduleId)}
          className="inline-flex items-center gap-2 text-[#8127cf] text-sm font-medium hover:gap-3 transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Retour au module
        </Link>
        <span className="text-sm text-[#7e7385]">
          Leçon {lesson.lessonNumber} / {lesson.totalLessons}
        </span>
      </div>

      {/* ── Layout 2 colonnes ────────────────────────────────────────────────── */}
      <div className="flex gap-6">

        {/* ── Colonne gauche (75%) ─────────────────────────────────────────────── */}
        <div className="flex-1 space-y-6">

          {/* Titre */}
          <div>
            <p className="text-sm text-[#7e7385] mb-1">{lesson.moduleTitle}</p>
            <h2 className="text-2xl font-bold font-display text-[#0b1c30]">
              Leçon {lesson.lessonNumber} — {lesson.title}
            </h2>
          </div>

          {/* ── Lecteur vidéo ──────────────────────────────────────────────────── */}
          <div className="relative w-full aspect-video bg-[#0d0d0d] rounded-2xl
                          overflow-hidden shadow-xl border border-white/10">
            {/* Simulation animation Manim */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-cyan-400 font-mono">
                  if <span className="text-white">temperature &gt; 30</span>:
                </div>
                <div className="text-3xl text-pink-400 font-mono animate-pulse">
                  print("Il fait chaud !")
                </div>
              </div>
            </div>

            {/* Contrôles vidéo */}
            <div className="absolute bottom-0 left-0 right-0 p-6
                            bg-gradient-to-t from-black/80 to-transparent pt-12">
              <div className="flex flex-col gap-4">
                {/* Barre de progression */}
                <div className="relative w-full h-1.5 bg-white/20 rounded-full cursor-pointer">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full"
                    style={{
                      width: `${lesson.progress}%`,
                      background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                    }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="text-white hover:text-pink-400 transition-colors">
                      <span className="material-symbols-outlined text-[32px]">play_circle</span>
                    </button>
                    <span className="text-white text-sm font-mono">
                      {lesson.currentTime} / {lesson.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-white hover:text-pink-400 transition-colors">
                      <span className="material-symbols-outlined">closed_caption</span>
                    </button>
                    <button className="text-white hover:text-pink-400 transition-colors">
                      <span className="material-symbols-outlined">fullscreen</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Exercice pratique ─────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl p-8 border border-cyan-100 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 rounded-full text-white text-[10px]
                               uppercase tracking-widest font-bold"
                    style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
                Exercice Pratique
              </span>
            </div>
            <h3 className="text-xl font-bold font-display text-[#0b1c30] mb-1">
              Testez votre code
            </h3>
            <p className="text-[#7e7385] mb-6 text-sm">
              Complétez le code selon la température du jour pour afficher le bon message.
            </p>

            {/* Éditeur de code */}
            <div className="bg-[#1e1e2e] rounded-xl overflow-hidden shadow-inner mb-6">
              {/* Header éditeur */}
              <div className="flex items-center justify-between px-4 py-3
                              bg-[#181825] border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-white/40 font-mono text-xs uppercase tracking-widest">
                  python
                </span>
              </div>

              {/* Code */}
              <div className="p-6 font-mono text-sm leading-loose">
                {lesson.code.map((row) => (
                  <div key={row.line} className="flex">
                    <span className="w-8 text-white/20 select-none">{row.line}</span>
                    <span>
                      {row.content.map((part, i) => (
                        <span key={i} style={{ color: part.color }}>{part.text}</span>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bouton exécuter */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setCodeExecuted(true)}
                className="px-8 py-3 rounded-xl text-white font-bold shadow-md
                           hover:scale-105 active:scale-95 transition-all"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
              >
                Exécuter le code
              </button>
            </div>

            {/* Output */}
            {codeExecuted && (
              <div className="bg-[#0b1c30] rounded-xl p-6 border border-white/5 font-mono text-sm">
                <div className="text-cyan-400 mb-2">&gt; Il fait chaud !</div>
                <div className="text-green-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">check_circle</span>
                  Code exécuté avec succès
                </div>
              </div>
            )}
          </div>
          {/* ── Notes de la leçon ────────────────────────────────────────────── */}
<div className="bg-white rounded-2xl border-l-4 border-[#8127cf] p-8 shadow-sm">
  <div className="flex items-center gap-3 mb-6">
    <span className="material-symbols-outlined text-[#8127cf] text-[24px]">
      description
    </span>
    <h3 className="text-xl font-bold font-display text-[#0b1c30]">
      Notes de la leçon
    </h3>
  </div>

  <div className="space-y-6 text-sm text-[#4d4354] leading-relaxed">
    <div>
      <h4 className="font-bold text-[#0b1c30] mb-2">
        Les structures conditionnelles (If/Else) :
      </h4>
      <ul className="space-y-2 list-disc list-inside">
        <li>
          Permettent d'exécuter des blocs de code différents selon
          qu'une condition soit vraie ou fausse.
        </li>
        <li>
          La condition est toujours une expression{' '}
          <span className="font-bold">booléenne</span> (True ou False).
        </li>
        <li>
          L'indentation en Python est cruciale pour définir la portée
          de la condition.
        </li>
      </ul>
    </div>

    {/* Exemple de code dans les notes */}
    <div className="bg-[#1e1e2e] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2
                      bg-[#181825] border-b border-white/5">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <span className="text-white/40 font-mono text-xs uppercase tracking-widest">
          python
        </span>
      </div>
      <div className="p-4 font-mono text-sm leading-loose">
        <div className="flex">
          <span className="w-8 text-white/20 select-none">1</span>
          <span>
            <span style={{ color: '#ff79c6' }}>if </span>
            <span style={{ color: '#f8f8f2' }}>temperature </span>
            <span style={{ color: '#ff79c6' }}>&gt; </span>
            <span style={{ color: '#bd93f9' }}>30</span>
            <span style={{ color: '#f8f8f2' }}>:</span>
          </span>
        </div>
        <div className="flex">
          <span className="w-8 text-white/20 select-none">2</span>
          <span>
            <span style={{ color: '#f8f8f2' }}>    print(</span>
            <span style={{ color: '#f1fa8c' }}>"Il fait chaud"</span>
            <span style={{ color: '#f8f8f2' }}>)</span>
          </span>
        </div>
        <div className="flex">
          <span className="w-8 text-white/20 select-none">3</span>
          <span style={{ color: '#ff79c6' }}>else</span>
          <span style={{ color: '#f8f8f2' }}>:</span>
        </div>
        <div className="flex">
          <span className="w-8 text-white/20 select-none">4</span>
          <span>
            <span style={{ color: '#f8f8f2' }}>    print(</span>
            <span style={{ color: '#f1fa8c' }}>"Il fait frais"</span>
            <span style={{ color: '#f8f8f2' }}>)</span>
          </span>
        </div>
      </div>
    </div>

    <div>
      <h4 className="font-bold text-[#0b1c30] mb-2">Points clés à retenir :</h4>
      <ul className="space-y-2 list-disc list-inside">
        <li><span className="font-mono text-[#8127cf] font-bold">IF</span> = Si vrai, alors fais ceci.</li>
        <li><span className="font-mono text-[#8127cf] font-bold">ELSE</span> = Sinon, fais autre chose.</li>
        <li><span className="font-mono text-[#8127cf] font-bold">ELIF</span> = Sinon si (condition supplémentaire).</li>
      </ul>
    </div>
  </div>
</div>

          {/* ── Navigation leçons ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between py-4">
            <Link
              to={ROUTES.LESSON(lesson.lessonNumber - 1)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl
                         border border-[#8127cf] text-[#8127cf] font-bold text-sm
                         hover:bg-[#8127cf]/5 transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">west</span>
              Leçon précédente
            </Link>

            {/* Points de progression */}
            <div className="flex gap-2">
              {lesson.plan.map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i + 1 < lesson.lessonNumber
                      ? 'w-2.5 h-2.5 bg-green-400'
                      : i + 1 === lesson.lessonNumber
                        ? 'w-3 h-3 bg-[#8127cf]'
                        : 'w-2.5 h-2.5 bg-[#cfc2d6]/30'
                  }`}
                />
              ))}
            </div>

            <Link
              to={ROUTES.LESSON(lesson.lessonNumber + 1)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl
                         text-white font-bold text-sm transition-all
                         hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
            >
              Leçon suivante
              <span className="material-symbols-outlined text-[20px]">east</span>
            </Link>
          </div>

        </div>

        {/* ── Colonne droite (25%) ─────────────────────────────────────────────── */}
        <div className="w-64 flex-shrink-0 space-y-4">

          {/* Plan du cours */}
          <div className="bg-white rounded-2xl p-5 border border-[#8127cf]/10 shadow-sm">
            <h3 className="text-base font-bold font-display text-[#0b1c30] mb-4">
              Plan du cours
            </h3>
            <div className="space-y-1">
              {lesson.plan.map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 p-2.5 rounded-lg
                              ${item.status === 'active' ? 'bg-[#f0dbff]' : ''}
                              ${item.status === 'locked' ? 'opacity-40' : ''}`}
                >
                  <span className={`material-symbols-outlined text-[18px]
                                   ${item.status === 'done'   ? 'text-green-500' :
                                     item.status === 'active' ? 'text-[#8127cf]' :
                                     'text-[#7e7385]'}`}>
                    {item.status === 'done'   ? 'check_circle' :
                     item.status === 'active' ? 'play_circle'  : 'lock'}
                  </span>
                  <span className={`text-sm
                                   ${item.status === 'active'
                                     ? 'text-[#8127cf] font-bold'
                                     : 'text-[#4d4354]'}`}>
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Progression */}
          <div className="bg-white rounded-2xl p-5 border border-[#8127cf]/10 shadow-sm">
            <h3 className="text-base font-bold font-display text-[#0b1c30] mb-4">
              Progression
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-[#7e7385]">Module 3</span>
              <span className="text-xs font-bold text-[#8127cf]">60%</span>
            </div>
            <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden mb-3">
              <div
                className="h-full rounded-full"
                style={{
                  width: '60%',
                  background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
                }}
              />
            </div>
            <div className="flex items-center gap-2 text-[#7e7385] text-xs">
              <span className="material-symbols-outlined text-[16px]">assignment_turned_in</span>
              3/6 leçons terminées
            </div>
          </div>

          {/* Astuce */}
          <div className="bg-[#fef9c3] rounded-2xl p-5 border border-yellow-200 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#854d0e]">
              <span className="material-symbols-outlined text-[20px]">lightbulb</span>
              <h3 className="text-base font-bold">Astuce</h3>
            </div>
            <p className="text-[#854d0e] text-xs leading-relaxed">
              {lesson.tip}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}