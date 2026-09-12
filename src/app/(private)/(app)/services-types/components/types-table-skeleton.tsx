import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function TypesTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: linhas de placeholder sem identidade
    <TableRow key={index}>
      <TableCell>
        <Skeleton className="h-3.5 w-64" />
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-56" />
      </TableCell>

      <TableCell>
        <Skeleton className="ml-auto h-7 w-20" />
      </TableCell>
    </TableRow>
  ))
}
