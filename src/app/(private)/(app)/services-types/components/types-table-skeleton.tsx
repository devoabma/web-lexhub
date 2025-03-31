import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { Edit } from 'lucide-react'

export function TypesTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <TableRow key={index}>
      <TableCell className="relative font-mono text-xs font-medium border-r">
        <Skeleton className="h-4 w-46 rounded" />
      </TableCell>

      <TableCell className="relative font-medium truncate border-r">
        <Skeleton className="h-4 w-82 rounded" />
      </TableCell>

      <TableCell className="flex items-center justify-center">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="rounded flex items-center w-full"
        >
          <Edit className="size-3.5 text-emerald-500" />
          <Skeleton className="h-4 w-16 rounded" />
        </Button>
      </TableCell>
    </TableRow>
  ))
}
