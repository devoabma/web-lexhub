'use client'

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { Button } from '../ui/button'

export interface PaginationProps {
  pageIndex: number
  totalCount: number
  perPage: number
  onPageChange: (pageIndex: number) => Promise<void> | void
}

export function Pagination({
  pageIndex,
  totalCount,
  perPage,
  onPageChange,
}: PaginationProps) {
  // FIXME: Busca o total de paginas senão usar o totalCount
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Total de {totalCount} item(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Página {pageIndex} de {pages}
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPageChange(1)}
            disabled={pageIndex === 1}
            variant="outline"
            size="icon"
            className="cursor-pointer rounded"
          >
            <ChevronsLeft className="size-4" />
            <span className="sr-only">Primeira página</span>
          </Button>

          <Button
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 1}
            variant="outline"
            size="icon"
            className="cursor-pointer rounded"
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <Button
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex === pages}
            variant="outline"
            size="icon"
            className="cursor-pointer rounded"
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Próxima página</span>
          </Button>

          <Button
            onClick={() => onPageChange(pages)}
            disabled={pageIndex === pages}
            variant="outline"
            size="icon"
            className="cursor-pointer rounded"
          >
            <ChevronsRight className="size-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
