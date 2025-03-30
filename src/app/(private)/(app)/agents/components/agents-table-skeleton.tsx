'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function AgentsTableSkeleton() {
  return Array.from({ length: 10 }).map((_, i) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <TableRow key={i} className="overflow-x-auto">
      <TableCell />

      <TableCell className="border-r">
        <Skeleton className="h-5 w-96 rounded" />
      </TableCell>

      <TableCell className="border-r">
        <Skeleton className="h-5 w-72 rounded" />
      </TableCell>

      <TableCell className="border-r text-center">
        <Skeleton className="h-5 w-28 mx-auto rounded-full" />
      </TableCell>

      <TableCell className="border-r text-center">
        <Skeleton className="h-5 w-28 mx-auto rounded-full" />
      </TableCell>

      <TableCell className="flex items-center gap-2">
        <Skeleton className="h-5 w-full rounded" />

        <Skeleton className="h-5 w-full rounded" />
      </TableCell>
    </TableRow>
  ))
}
