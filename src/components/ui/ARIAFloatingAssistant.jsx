// src/components/ui/ARIAFloatingAssistant.jsx
import { useState, useRef, useEffect } from 'react'

const suggestions = [
  { label: '📜 Certifications ?',  text: 'Comment obtenir un certificat ?' },
  { label: '🇲🇦 NLP Darija ?',    text: 'Y a-t-il du contenu en Darija ?' },
  { label: '💎 Plan Illimité ?',   text: 'Que comprend le plan Illimité ?' },
  { label: '🧠 C\'est quoi un LLM ?', text: 'Explique-moi ce qu\'est un LLM' },
]

const getResponse = (input) => {
  const t = input.toLowerCase()
  if (t.includes('salam') || t.includes('bonjour') || t.includes('salut') || t.includes('hello'))
    return "Salam ! 🌟 Je suis ARIA, votre assistante IA personnelle. Je suis là pour vous aider dans votre parcours d'apprentissage. Que voulez-vous explorer aujourd'hui ?"
  if (t.includes('certificat') || t.includes('diplome'))
    return "Pour obtenir votre certificat IAAI, vous devez compléter tous les modules et réussir les quiz avec un score ≥ 80%. Il sera partageable directement sur LinkedIn ! 🎓"
  if (t.includes('darija') || t.includes('maroc'))
    return "Nos contenus incluent des exemples contextualisés pour le Maroc. Un module spécial NLP Darija est prévu dans la roadmap 2026 ! 🇲🇦"
  if (t.includes('illimité') || t.includes('prix') || t.includes('abonnement') || t.includes('payant'))
    return "Le plan Illimité à 99 MAD/mois vous donne accès aux 7 modules, à ARIA sans limite, aux notebooks Python et au certificat officiel. Annulable à tout moment ✨"
  if (t.includes('quiz'))
    return "Chaque module se termine par un quiz de 5 à 10 questions. Vous avez besoin de 80% pour valider le module. Vous pouvez le recommencer autant de fois que nécessaire ! 💪"
  if (t.includes('llm') || t.includes('gpt') || t.includes('modèle'))
    return "Un LLM (Large Language Model) est un modèle d'IA entraîné sur d'énormes quantités de texte. Il peut générer, résumer et analyser du langage naturel. ChatGPT, Claude et Gemini sont des LLMs 🤖"
  if (t.includes('module') || t.includes('cours'))
    return "Votre parcours IAAI comprend 7 modules progressifs : des bases de l'IA jusqu'aux LLMs et à l'IA générative. Les modules 1 à 4 sont déjà disponibles ! 🚀"
  return "Bonne question ! 🧠 Ce concept est couvert en profondeur dans votre parcours IAAI. Souhaitez-vous que je vous redirige vers la leçon correspondante ?"
}

export default function ARIAFloatingAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      from: 'aria',
      text: "Marhaban ! 🇲🇦 Je suis ARIA, votre assistante d'apprentissage IA. Comment puis-je vous aider aujourd'hui ?",
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  const send = (text) => {
    const t = (text || input).trim()
    if (!t) return
    const now = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: t, time: now }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        from: 'aria',
        text: getResponse(t),
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      }])
    }, 1000 + Math.random() * 600)
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* Chat window */}
      {open && (
        <div className="absolute bottom-20 right-0 w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl
                        border border-[#ded6f3] flex flex-col overflow-hidden
                        animate-[fadeInUp_.2s_ease-out]">

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 text-white shrink-0"
               style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 60%, #0891b2 100%)' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">ARIA</p>
                <p className="text-[10px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Assistante IA · En ligne
                </p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
                    className="w-8 h-8 rounded-xl hover:bg-white/20 flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-white text-[18px]">close</span>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f8f5ff]/40">
            {messages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.from === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                  msg.from === 'user'
                    ? 'text-white rounded-tr-none'
                    : 'bg-white border border-[#ded6f3] text-[#17132f] rounded-tl-none'
                }`} style={msg.from === 'user' ? { background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' } : {}}>
                  {msg.text}
                </div>
                <span className="text-[9px] text-[#68627a] mt-1 px-1">{msg.time}</span>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex items-start">
                <div className="bg-white border border-[#ded6f3] rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1">
                  {[0, 150, 300].map(d => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#8127cf] animate-bounce"
                          style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions */}
          <div className="px-3 py-2 border-t border-[#f0dbff]/50 flex gap-1.5 overflow-x-auto scrollbar-none shrink-0">
            {suggestions.map(s => (
              <button key={s.text} onClick={() => send(s.text)}
                      className="text-[10px] whitespace-nowrap bg-white border border-[#ded6f3] hover:border-[#8127cf]/50
                                 hover:bg-[#f0dbff]/50 text-[#8127cf] font-semibold px-2.5 py-1.5 rounded-full transition-all">
                {s.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-[#ded6f3] bg-white flex items-center gap-2 shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Posez une question à ARIA..."
              className="flex-1 h-10 px-3 bg-[#f8f5ff] border border-[#ded6f3] rounded-xl text-xs
                         focus:outline-none focus:border-[#8127cf] focus:ring-2 focus:ring-[#8127cf]/20
                         text-[#17132f] placeholder:text-[#68627a] transition-all"
            />
            <button onClick={() => send()}
                    disabled={!input.trim()}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white
                               disabled:opacity-40 hover:shadow-md transition-all active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}>
              <span className="material-symbols-outlined text-[18px]">send</span>
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-5 py-3.5 rounded-full text-white font-bold text-sm
                   shadow-xl hover:shadow-2xl hover:-translate-y-1 active:scale-95 transition-all duration-300"
        style={{ background: 'linear-gradient(135deg, #ec4899 0%, #8127cf 100%)' }}
      >
        <div className="relative">
          <span className="material-symbols-outlined text-[20px]">smart_toy</span>
          <span className="absolute -top-1.5 -right-1.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white animate-pulse" />
        </div>
        ARIA
      </button>
    </div>
  )
}
