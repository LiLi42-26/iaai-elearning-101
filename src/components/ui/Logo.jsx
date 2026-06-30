// src/components/ui/Logo.jsx
// Logo officiel IAAI eLearning 101 — image avec fond rendu transparent
// (le fichier logo-iaai.png original avait un léger fond lavande visible
// en carré sur la sidebar blanche ; il a été nettoyé pour fondre parfaitement
// dans n'importe quel fond clair de l'interface).

import logoSrc from '@/assets/logo-iaai.png'

const HEIGHTS = {
  sm: 'h-7',
  md: 'h-10',
  lg: 'h-14',
}

export default function Logo({ size = 'md', className = '' }) {
  const h = HEIGHTS[size] ?? HEIGHTS.md

  return (
    <img
      src={logoSrc}
      alt="IAAI eLearning 101"
      className={`${h} w-auto object-contain ${className}`}
    />
  )
}