// scripts/embed-chunks.js
// Script d'ingestion — découpe les leçons en chunks et génère les embeddings Gemini
//
// Usage :
//   node scripts/embed-chunks.js           → toutes les leçons
//   node scripts/embed-chunks.js --force   → réingère tout

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const SUPABASE_URL      = process.env.VITE_SUPABASE_URL
const SERVICE_ROLE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY
const GEMINI_API_KEY    = process.env.GEMINI_API_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
  console.error('❌ Variables manquantes dans .env :')
  console.error('   VITE_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

const EMBED_URL   = `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GEMINI_API_KEY}`
const CHUNK_SIZE  = 400  // mots par chunk
const OVERLAP     = 40   // mots de chevauchement

// ─── Découper un texte en chunks ─────────────────────────────────────────────
function splitIntoChunks(text) {
  if (!text?.trim()) return []
  const words  = text.split(/\s+/)
  const chunks = []
  let i = 0
  while (i < words.length) {
    const chunk = words.slice(i, i + CHUNK_SIZE).join(' ').trim()
    if (chunk) chunks.push(chunk)
    i += CHUNK_SIZE - OVERLAP
  }
  return chunks
}

// ─── Générer un embedding Gemini ─────────────────────────────────────────────
async function getEmbedding(text) {
  const res = await fetch(EMBED_URL, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model:   'models/gemini-embedding-001',
      content: { parts: [{ text }] },
    }),
  })
  const data = await res.json()
  if (!data?.embedding?.values) {
    throw new Error('Embedding échoué : ' + JSON.stringify(data))
  }
  return data.embedding.values
}

// ─── Ingérer une leçon ────────────────────────────────────────────────────────
async function ingestLesson(lesson, force) {
  const text = lesson.content_notes
  if (!text?.trim()) {
    console.log(`  ⚠️  "${lesson.title}" — pas de content_notes, ignorée`)
    return 0
  }

  if (!force) {
    const { count } = await supabase
      .from('lesson_chunks')
      .select('id', { count: 'exact', head: true })
      .eq('lesson_id', lesson.id)
    if (count > 0) {
      console.log(`  ✓  "${lesson.title}" — déjà indexée (${count} chunks)`)
      return 0
    }
  } else {
    await supabase.from('lesson_chunks').delete().eq('lesson_id', lesson.id)
  }

  const chunks = splitIntoChunks(text)
  console.log(`  📝 "${lesson.title}" — ${chunks.length} chunks`)

  const rows = []
  for (let idx = 0; idx < chunks.length; idx++) {
    process.stdout.write(`    [${idx + 1}/${chunks.length}] embedding...`)
    const embedding = await getEmbedding(chunks[idx])
    rows.push({
      lesson_id:   lesson.id,
      module_id:   lesson.module_id,
      chunk_index: idx,
      content:     chunks[idx],
      embedding:   `[${embedding.join(',')}]`,
    })
    process.stdout.write(' ✓\n')
    // Rate limit Gemini Free : 1 req/sec
    await new Promise(r => setTimeout(r, 1100))
  }

  const { error } = await supabase.from('lesson_chunks').insert(rows)
  if (error) throw new Error(`Insert error: ${error.message}`)
  console.log(`  ✅ ${rows.length} chunks insérés`)
  return rows.length
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀 IAAI — Script d\'ingestion des embeddings\n')

  const force = process.argv.includes('--force')
  if (force) console.log('⚠️  Mode --force : réingestion complète\n')

  const { data: lessons, error } = await supabase
    .from('lessons')
    .select('id, title, module_id, content_notes')

  if (error) { console.error('❌ Supabase error:', error.message); process.exit(1) }
  if (!lessons?.length) { console.log('⚠️  Aucune leçon trouvée'); process.exit(0) }

  console.log(`📚 ${lessons.length} leçon(s) trouvée(s)\n`)

  let total = 0
  for (const lesson of lessons) {
    console.log(`📖 ${lesson.title}`)
    total += await ingestLesson(lesson, force)
  }

  console.log(`\n✅ Terminé — ${total} chunks créés au total`)
}

main().catch(err => { console.error('❌', err.message); process.exit(1) })