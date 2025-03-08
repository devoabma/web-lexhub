'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Ban, Edit, LockOpen } from 'lucide-react'
import { useState } from 'react'
import { InactiveAgent } from './inactive-agent'
import { UpdateAgentDialog } from './update-agent-dialog'

interface AgentTableRowProps {
  agents: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
    inactive: string | null
  }
}

export function AgentTableRow({ agents }: AgentTableRowProps) {
  console.log(agents.inactive)
  // FIXME: Controla se o dialog esta aberto ou nao
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInactiveDialogOpen, isSetInactiveDialogOpen] = useState(false)

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
        {agents.inactive ? 'Sim' : 'Nao'}
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
        <Dialog
          open={isInactiveDialogOpen}
          onOpenChange={isSetInactiveDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded flex items-center cursor-pointer"
            >
              {agents.inactive ? (
                <>
                  <LockOpen className="size-3 text-green-600" />
                  Permitir acesso
                </>
              ) : (
                <>
                  <Ban className="size-3 text-amber-600" />
                  Revogar acesso
                </>
              )}
            </Button>
          </DialogTrigger>

          {/* FIXME: Componente que desativa o funcionario */}
          <InactiveAgent
            agents={agents}
            onOpenChange={isSetInactiveDialogOpen}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
