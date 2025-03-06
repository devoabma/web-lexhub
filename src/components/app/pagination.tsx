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
}

export function Pagination({
  pageIndex,
  totalCount,
  perPage,
}: PaginationProps) {
  // FIXME: Busca o total de paginas senão usar o totalCount
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Total de {totalCount} atendimento(s)
      </span>

      <div className="flex items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Página {pageIndex + 1} de {pages}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded"
          >
            <ChevronsLeft className="size-4" />
            <span className="sr-only">Primeira página</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded"
          >
            <ChevronLeft className="size-4" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer rounded"
          >
            <ChevronRight className="size-4" />
            <span className="sr-only">Próxima página</span>
          </Button>

          <Button
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
