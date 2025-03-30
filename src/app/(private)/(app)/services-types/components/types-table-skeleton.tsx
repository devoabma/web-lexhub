'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function TypesTableSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <TableRow key={i} className="overflow-x-auto">
      <TableCell className="border-r">
        <Skeleton className="h-5 w-96 rounded" />
      </TableCell>

      <TableCell className="relative font-medium truncate border-r">
        <Skeleton className="h-5 w-96 rounded" />
      </TableCell>

      <TableCell className="flex items-center justify-center">
        <Skeleton className="h-5 w-full rounded" />
      </TableCell>
    </TableRow>
  ))
}
