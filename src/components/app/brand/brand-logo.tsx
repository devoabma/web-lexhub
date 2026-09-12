import Image from 'next/image'

import LogoOabLight from '@/assets/logo-oabma-light.png'
import LogoOabSymbol from '@/assets/logo-oabma-symbol.png'
import LogoOabDark from '@/assets/logo-oabma.png'
import { cn } from '@/lib/utils'

interface BrandLogoProps {
  variant?: 'full' | 'symbol'
  priority?: boolean
  className?: string
}

const ALT = 'OAB Maranhão'

// Logo oficial da OAB Maranhão. A troca entre a versão de texto escuro (tema
// claro) e a de texto branco (tema escuro) é feita por CSS, sem esperar a
// hidratação, para não piscar a variante errada.
export function BrandLogo({
  variant = 'full',
  priority = false,
  className,
}: BrandLogoProps) {
  if (variant === 'symbol') {
    return (
      <Image
        src={LogoOabSymbol}
        alt={ALT}
        priority={priority}
        className={cn('h-auto w-full', className)}
      />
    )
  }

  return (
    <span className={cn('inline-block min-w-[120px]', className)}>
      <Image
        src={LogoOabLight}
        alt={ALT}
        priority={priority}
        className="h-auto w-full dark:hidden"
      />
      <Image
        src={LogoOabDark}
        alt={ALT}
        priority={priority}
        className="hidden h-auto w-full dark:block"
      />
    </span>
  )
}
