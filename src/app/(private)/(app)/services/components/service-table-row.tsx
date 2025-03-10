'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { CheckCircle, CircleX, Eye } from 'lucide-react'
import { ServiceDetails } from './service-details'

export function ServiceTableRow() {
  return (
    <TableRow className="overflow-x-auto">
      <TableCell className="w-full border-r sm:w-auto">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded cursor-pointer "
            >
              <Eye className="size-3" />
              <span className="sr-only">Detalhes do atendimento</span>
            </Button>
          </DialogTrigger>

          {/* FIXME: Componente de Detalhes do Atendimento */}
          <ServiceDetails />
        </Dialog>
      </TableCell>

      <TableCell className="border-r">
        <div className="flex items-center gap-2">
          <span className="block h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium">Em andamento</span>
        </div>
      </TableCell>

      <TableCell className="text-muted-foreground border-r">
        há 5 minutos
      </TableCell>

      <TableCell className="font-mono text-xs font-medium border-r">
        PRESENCIAL
      </TableCell>

      <TableCell className="font-mono text-xs font-medium border-r">
        22158
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        Dalene Ferreira Melo dos Santos
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        Hilquias Ferreira Melo
      </TableCell>

      <TableCell>
        <Button
          variant="outline"
          size="sm"
          className="rounded flex items-center cursor-pointer"
        >
          <CheckCircle className="size-3 text-yellow-600" />
          Concluir
        </Button>
      </TableCell>

      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="rounded flex items-center cursor-pointer"
        >
          <CircleX className="size-3 text-rose-800" />
          Cancelar
        </Button>
      </TableCell>
    </TableRow>
  )
}
