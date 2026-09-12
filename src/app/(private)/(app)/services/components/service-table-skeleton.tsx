import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function ServiceTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: linhas de placeholder sem identidade
    <TableRow key={index}>
      <TableCell>
        <div className="flex flex-col gap-1.5 py-0.5">
          <Skeleton className="h-3.5 w-48" />
          <Skeleton className="h-3 w-20" />
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-24" />
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-20" />
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <Skeleton className="h-3.5 w-40" />
      </TableCell>

      <TableCell className="hidden lg:table-cell">
        <Skeleton className="h-3.5 w-28" />
      </TableCell>

      <TableCell>
        <div className="flex items-center justify-end gap-1">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="size-7" />
        </div>
      </TableCell>
    </TableRow>
  ))
}
