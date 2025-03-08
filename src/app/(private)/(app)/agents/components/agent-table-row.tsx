'use client'

import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'
import { Ban, Edit } from 'lucide-react'

export function AgentTableRow() {
  return (
    <TableRow className="overflow-x-auto">
      <TableCell className="font-medium truncate max-w-xs border-r">
        Hilquias Ferreira Melo
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        hilquiasfmelo@gmail.com
      </TableCell>

      <TableCell className="font-mono text-xs font-medium border-r">
        MEMBRO
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        Não
      </TableCell>

      <TableCell>
        <Button
          variant="outline"
          size="sm"
          className="rounded flex items-center cursor-pointer"
        >
          <Edit className="size-3 text-emerald-600" />
          Alterar
        </Button>
      </TableCell>

      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          className="rounded flex items-center cursor-pointer"
        >
          <Ban className="size-3 text-amber-600" />
          Inativar
        </Button>
      </TableCell>
    </TableRow>
  )
}
