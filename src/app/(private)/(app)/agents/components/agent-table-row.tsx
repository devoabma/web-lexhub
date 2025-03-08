'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Ban, Edit } from 'lucide-react'
import { useState } from 'react'
import { UpdateAgentDialog } from './update-agent-dialog'

interface AgentTableRowProps {
  agents: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
    inactivedAt?: string | null
  }
}

export function AgentTableRow({ agents }: AgentTableRowProps) {
  // FIXME: Controla se o dialog esta aberto ou nao
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <TableRow className="overflow-x-auto">
      <TableCell className="font-medium truncate max-w-xs border-r">
        {agents.name}
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        {agents.email}
      </TableCell>

      <TableCell className="font-mono text-xs font-medium border-r">
        {agents.role}
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        {agents.inactivedAt ? 'Sim' : 'Não'}
      </TableCell>

      <TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="rounded flex items-center cursor-pointer"
            >
              <Edit className="size-3 text-emerald-600" />
              Alterar
            </Button>
          </DialogTrigger>

          {/* FIXME: Componente de Atualizar Funcionario */}
          <UpdateAgentDialog agents={agents} onOpenChange={setIsDialogOpen} />
        </Dialog>
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
