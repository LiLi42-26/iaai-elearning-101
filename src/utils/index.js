// src/utils/index.js
// Utilitaires partagés dans tout le projet

// ─── Temps relatif ────────────────────────────────────────────────────────────
export function formatRelativeTime(isoString) {
  if (!isoString) return 'Récemment'
  const diff    = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours   = Math.floor(diff / 3600000)
  const days    = Math.floor(diff / 86400000)
  if (minutes < 2)  return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes} min`
  if (hours < 24)   return `Il y a ${hours}h`
  if (days === 1)   return 'Hier'
  if (days < 30)    return `Il y a ${days} jours`
  return formatDate(isoString)
}

// ─── Date lisible ─────────────────────────────────────────────────────────────
export function formatDate(isoString) {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ─── Durée en minutes → "1h 30min" ou "45 min" ───────────────────────────────
export function formatDuration(minutes) {
  if (!minutes || minutes <= 0) return '0 min'
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

// ─── Initiales depuis un nom complet ─────────────────────────────────────────
export function getInitials(fullName) {
  if (!fullName) return 'U'
  return fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0].toUpperCase())
    .slice(0, 2)
    .join('')
}

// ─── Extraire l'ID d'une URL YouTube ─────────────────────────────────────────
// Supporte : watch?v=xxx, youtu.be/xxx, embed/xxx
export function extractYouTubeId(url) {
  if (!url) return null
  const patterns = [
    /[?&]v=([^&#]+)/,
    /youtu\.be\/([^?&#]+)/,
    /embed\/([^?&#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// ─── Concaténer des classes CSS conditionnellement ───────────────────────────
export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

// ─── Tronquer un texte ────────────────────────────────────────────────────────
export function truncate(text, maxLength = 80) {
  if (!text) return ''
  return text.length <= maxLength ? text : text.slice(0, maxLength).trimEnd() + '…'
}

// ─── Capitaliser la première lettre ──────────────────────────────────────────
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// ─── Numéro de certificat lisible ─────────────────────────────────────────────
// "IAAI-MOD1-ABC12" → "IAAI · MOD1 · ABC12"
export function formatCertNumber(certNumber) {
  if (!certNumber) return ''
  return certNumber.replace(/-/g, ' · ')
}