import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { Edit3, Lock } from 'lucide-react'

export function AgentsTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <TableRow key={index} className="overflow-x-auto">
      <TableCell />

      <TableCell className="font-medium truncate max-w-xs border-r">
        <Skeleton className="h-4 w-68 rounded" />
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        <Skeleton className="h-4 w-50 rounded" />
      </TableCell>

      <TableCell className="font-mono text-xs font-medium border-r text-center">
        <Skeleton className="h-4 w-28 mx-auto rounded-full" />
      </TableCell>

      <TableCell className="font-mono tracking-tight text-xs truncate max-w-xs border-r text-center">
        <Skeleton className="h-4 w-24 mx-auto rounded-full" />
      </TableCell>

      <TableCell className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled
          className="rounded flex items-center gap-2"
        >
          <Edit3 className="size-3.5" />
          <Skeleton className="h-4 w-16 rounded" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          disabled
          className="rounded flex items-center gap-2"
        >
          <Lock className="size-3.5 text-rose-600" />
          <Skeleton className="h-4 w-16 rounded" />
        </Button>
      </TableCell>
    </TableRow>
  ))
}
