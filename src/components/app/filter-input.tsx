import { type LucideIcon, Search } from 'lucide-react'
import type * as React from 'react'

import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type FilterInputProps = React.ComponentProps<typeof Input> & {
  icon?: LucideIcon
  // Classe do contêiner (largura); `className` fica com o próprio input
  wrapperClassName?: string
}

// Campo de filtro com ícone à esquerda. Os demais props (id, aria-*, ref do
// react-hook-form) vão direto para o <input>, então funciona dentro de FormControl.
export function FilterInput({
  icon: Icon = Search,
  wrapperClassName,
  className,
  ...props
}: FilterInputProps) {
  return (
    <div className={cn('relative', wrapperClassName)}>
      <Icon
        aria-hidden
        className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-2.5 size-3.5 text-muted-foreground"
      />
      <Input className={cn('pl-8', className)} {...props} />
    </div>
  )
}
