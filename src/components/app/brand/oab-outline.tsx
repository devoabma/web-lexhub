import { cn } from '@/lib/utils'

interface OabOutlineProps {
  className?: string
}

// "OAB" em contorno — aplicação simplificada da marca prevista no manual,
// usada como marca d'água. A cor vem de `currentColor`.
export function OabOutline({ className }: OabOutlineProps) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 312 124"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={cn('pointer-events-none select-none', className)}
    >
      <circle cx="58" cy="62" r="54" vectorEffect="non-scaling-stroke" />
      <path d="M118 116 168 8l50 108Z" vectorEffect="non-scaling-stroke" />
      <path
        d="M226 8h36c25 0 38 15 38 32 0 10-5 18-13 23 14 6 21 18 21 30 0 14-11 23-29 23h-53Z"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}
