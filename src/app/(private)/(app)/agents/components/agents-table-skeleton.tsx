import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'

export function AgentsTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: linhas de placeholder sem identidade
    <TableRow key={index}>
      <TableCell>
        <div className="flex items-center gap-2.5">
          <Skeleton className="size-7 rounded-full" />
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-3.5 w-44" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <Skeleton className="h-5 w-24" />
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <Skeleton className="h-5 w-16" />
      </TableCell>

      <TableCell>
        <Skeleton className="ml-auto size-7" />
      </TableCell>
    </TableRow>
  ))
}
