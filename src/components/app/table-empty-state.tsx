import type { LucideIcon } from 'lucide-react'

import { TableCell, TableRow } from '@/components/ui/table'

interface TableEmptyStateProps {
  colSpan: number
  icon: LucideIcon
  title: string
  description?: string
}

export function TableEmptyState({
  colSpan,
  icon: Icon,
  title,
  description,
}: TableEmptyStateProps) {
  return (
    <TableRow className="hover:bg-transparent">
      <TableCell colSpan={colSpan} className="h-48 whitespace-normal">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex size-10 items-center justify-center rounded-full border bg-muted">
            <Icon className="size-4.5 text-muted-foreground" aria-hidden />
          </div>
          <p className="font-medium text-foreground">{title}</p>
          {description && (
            <p className="max-w-sm text-muted-foreground text-xs">
              {description}
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
