import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { TableCell, TableRow } from '@/components/ui/table'
import { CheckCircle, CircleX, Search } from 'lucide-react'

export function ServiceTableSkeleton() {
  return Array.from({ length: 10 }).map((_, index) => (
    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
    <TableRow key={index} className="overflow-x-auto">
      <TableCell className="w-full border-r sm:w-auto">
        <Button variant="outline" size="sm" disabled className="rounded">
          <Search className="size-3.5" />
        </Button>
      </TableCell>

      <TableCell className="border-r">
        <div className="flex items-center gap-2">
          <Skeleton className="h-2 w-2 rounded-full" />
          <Skeleton className="h-4 w-20 rounded" />
        </div>
      </TableCell>

      <TableCell className="text-center border-r">
        <Skeleton className="h-4 w-24 mx-auto rounded" />
      </TableCell>

      <TableCell className="font-mono text-xs font-medium text-center border-r">
        <Skeleton className="h-4 w-16 mx-auto rounded-full" />
      </TableCell>

      <TableCell className="font-mono text-xs font-medium text-center border-r">
        <Skeleton className="h-4 w-16 mx-auto rounded" />
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        <Skeleton className="h-4 w-72 rounded" />
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        <Skeleton className="h-4 w-52 rounded" />
      </TableCell>

      <TableCell>
        <Button
          variant="outline"
          size="sm"
          disabled
          className="rounded flex items-center"
        >
          <CheckCircle className="size-3.5 text-yellow-600" />
          <Skeleton className="h-4 w-16 rounded" />
        </Button>
      </TableCell>

      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          disabled
          className="rounded flex items-center"
        >
          <CircleX className="size-3.5 text-rose-800" />
          <Skeleton className="h-4 w-16 rounded" />
        </Button>
      </TableCell>
    </TableRow>
  ))
}
