// src/pages/Quiz/QuizPage.jsx
import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

// ─── Données mockées ─────────────────────────────────────────────────────────
const quizData = {
  3: {
    title: 'Quiz — Concepts de programmation',
    subtitle: 'Testez vos connaissances sur le Module 3',
    moduleId: 3,
    questions: 10,
    duration: 8,
    passingScore: 70,
    attempts: 1,
    questionsList: [
      {
        id: 1,
        question: "Quelle est la syntaxe correcte pour une condition en Python ?",
        options: [
          "if (x > 5) { }",
          "if x > 5:",
          "if x > 5 then",
          "condition x > 5:",
        ],
        correct: 1,
      },
      {
        id: 2,
        question: "Que fait le mot-clé 'else' en Python ?",
        options: [
          "Il répète un bloc de code",
          "Il définit une fonction",
          "Il exécute un bloc si la condition if est fausse",
          "Il importe une bibliothèque",
        ],
        correct: 2,
      },
      {
        id: 3,
        question: "Quelle est la valeur de x après : x = 5 + 3 * 2 ?",
        options: ["16", "11", "13", "10"],
        correct: 1,
      },
    ],
  },
}

export default function QuizPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const quiz = quizData[id] || quizData[3]

  const [phase, setPhase] = useState('intro') // 'intro' | 'questions'
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [timeLeft] = useState(quiz.duration * 60)
  const handleStart = () => setPhase('questions')

  const handleAnswer = (optionIndex) => setSelected(optionIndex)

  const handleNext = () => {
    const newAnswers = [...answers, selected]
    if (currentQ + 1 >= quiz.questionsList.length) {
      const score = newAnswers.reduce((acc, ans, i) => {
        return acc + (ans === quiz.questionsList[i].correct ? 1 : 0)
      }, 0)
      navigate(`/quiz/result/${id}`, {
        state: { score, total: quiz.questionsList.length, quizTitle: quiz.title }
      })
    } else {
      setAnswers(newAnswers)
      setCurrentQ(currentQ + 1)
      setSelected(null)
    }
  }

  // ── Phase : Intro ───────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center relative">
        {/* Glows décoratifs */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-[#8127cf]/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[10%] w-80 h-80 bg-pink-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Card principale */}
        <div className="w-full max-w-2xl bg-white rounded-2xl p-10 border
                        border-[#8127cf]/10 shadow-sm relative z-10">
          <div className="flex flex-col items-center text-center">

            {/* Icône */}
            <div className="w-16 h-16 bg-[#f0dbff] rounded-full flex items-center
                            justify-center mb-6">
              <span className="material-symbols-outlined text-[#8127cf] text-[32px]">quiz</span>
            </div>

            {/* Titre */}
            <h1 className="text-3xl font-bold font-display text-[#0b1c30] mb-2">
              {quiz.title}
            </h1>
            <p className="text-lg text-[#7e7385] mb-8">{quiz.subtitle}</p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mb-8 w-full">
              {[
                { value: quiz.questions,     label: 'questions' },
                { value: quiz.duration,      label: 'minutes'   },
                { value: `${quiz.passingScore}%`, label: 'pour réussir' },
                { value: quiz.attempts,      label: 'tentative' },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-2xl font-bold text-[#8127cf]">{stat.value}</span>
                  <span className="text-xs text-[#7e7385] uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>

            <hr className="w-full border-[#f0f0f5] mb-8" />

            {/* Info list */}
            <ul className="w-full space-y-4 mb-10 text-left px-4">
              {[
                'Questions à choix multiple',
                'Une question à la fois',
                'Résultat immédiat à la fin',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-[#4d4354]">
                  <div className="w-6 h-6 bg-[#f0dbff] rounded-full flex items-center
                                  justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-[14px] text-[#8127cf]">
                      check_circle
                    </span>
                  </div>
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>

            {/* Bouton commencer */}
            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl text-white text-lg font-bold
                         shadow-lg transition-all active:scale-[0.98] mb-4"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
            >
              Commencer le quiz
            </button>

            <Link
              to={ROUTES.MODULE(quiz.moduleId)}
              className="flex items-center gap-2 text-[#8127cf] text-sm font-medium
                         hover:underline"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Retour au module
            </Link>

          </div>
        </div>

        {/* ARIA FAB */}
        <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full text-white
                           shadow-lg flex flex-col items-center justify-center
                           hover:scale-110 active:scale-95 transition-all z-50"
                style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
          <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
          <span className="text-[9px] font-bold uppercase tracking-tight">ARIA</span>
        </button>
      </div>
    )
  }

  // ── Phase : Questions ───────────────────────────────────────────────────────
  const question = quiz.questionsList[currentQ]
  const progress = ((currentQ) / quiz.questionsList.length) * 100

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-2xl">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-[#7e7385]">
            Question {currentQ + 1} / {quiz.questionsList.length}
          </span>
          <div className="flex items-center gap-2 text-sm text-[#8127cf] font-bold">
            <span className="material-symbols-outlined text-[18px]">timer</span>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </div>
        </div>

        {/* Barre de progression */}
        <div className="h-2 w-full bg-[#e5eeff] rounded-full overflow-hidden mb-8">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)'
            }}
          />
        </div>

        {/* Card question */}
        <div className="bg-white rounded-2xl p-8 border border-[#8127cf]/10 shadow-sm mb-6">
          <h2 className="text-xl font-bold font-display text-[#0b1c30] mb-8">
            {question.question}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                className={`w-full text-left px-6 py-4 rounded-xl border-2 text-sm
                            font-medium transition-all
                            ${selected === i
                              ? 'border-[#8127cf] bg-[#f0dbff] text-[#8127cf]'
                              : 'border-[#f0f0f5] bg-white text-[#4d4354] hover:border-[#8127cf]/30 hover:bg-[#f0dbff]/20'
                            }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center
                                   text-sm font-bold flex-shrink-0 border-2
                                   ${selected === i
                                     ? 'border-[#8127cf] bg-[#8127cf] text-white'
                                     : 'border-[#cfc2d6] text-[#7e7385]'}`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Bouton suivant */}
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="w-full py-4 rounded-xl text-white font-bold transition-all
                     active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}
        >
          {currentQ + 1 >= quiz.questionsList.length ? 'Terminer le quiz' : 'Question suivante'}
          <span className="material-symbols-outlined text-[18px] ml-2 align-middle">
            arrow_forward
          </span>
        </button>

      </div>

      {/* ARIA FAB */}
      <button className="fixed bottom-8 right-8 w-16 h-16 rounded-full text-white
                         shadow-lg flex flex-col items-center justify-center
                         hover:scale-110 active:scale-95 transition-all z-50"
              style={{ background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)' }}>
        <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
        <span className="text-[9px] font-bold uppercase tracking-tight">ARIA</span>
      </button>
    </div>
  )
}