import { useId } from 'react'

import { cn } from '@/lib/utils'

interface BrandWaveProps {
  className?: string
}

// Onda azul e vermelha do Manual de Identidade Visual da OAB, ancorada no
// canto superior direito do contêiner. Elemento puramente decorativo.
export function BrandWave({ className }: BrandWaveProps) {
  const id = useId()
  const redGradient = `${id}-red`
  const blueGradient = `${id}-blue`

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 400 200"
      preserveAspectRatio="xMaxYMin meet"
      className={cn('pointer-events-none select-none', className)}
    >
      <defs>
        <linearGradient id={redGradient} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="var(--brand-red)" />
          <stop offset="1" stopColor="var(--brand-red-dark)" />
        </linearGradient>
        <linearGradient id={blueGradient} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="var(--brand-blue)" />
          <stop offset="1" stopColor="var(--brand-navy)" />
        </linearGradient>
      </defs>

      <path
        d="M0 0C120 6 228 62 298 150C328 186 368 199 400 198"
        fill="none"
        stroke="var(--brand-red)"
        strokeWidth="1.25"
      />
      <path
        d="M70 0C176 16 252 72 318 140C348 170 378 180 400 178V0Z"
        fill={`url(#${redGradient})`}
      />
      <path
        d="M150 0C226 22 282 70 330 108C360 130 384 136 400 133V0Z"
        fill={`url(#${blueGradient})`}
      />
    </svg>
  )
}
