'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Lock, LockOpen, Pencil } from 'lucide-react'
import { useState } from 'react'
import { ActiveAgent } from './active-agent'
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
  // Controle dos dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInactiveDialogOpen, isSetInactiveDialogOpen] = useState(false)
  const [isActiveDialogOpen, isSetActiveDialogOpen] = useState(false)

  const isAdmin = agents.role === 'ADMIN' && 'ADMINISTRADOR'

  // Formata a data de inatividade se for válida
  const inactiveDate = agents.inactive
    ? (() => {
        const data = parseISO(agents.inactive)
        return isValid(data)
          ? `Inativo há ${formatDistanceToNow(data, { locale: ptBR })}`
          : 'ATIVO'
      })()
    : 'ATIVO'
  // const inactiveDate = agents.inactive
  //   ? (() => {
  //       const data = parseISO(agents.inactive)
  //       return isValid(data) && format(data, "'Inativado em' dd/MM/yyyy'")
  //     })()
  //   : 'ATIVO'

  return (
    <TableRow className="overflow-x-auto">
      <TableCell
        className={`font-medium truncate max-w-xs border-r ${
          agents.inactive && 'opacity-40'
        }`}
      >
        {agents.name}
      </TableCell>

      <TableCell
        className={`font-medium truncate max-w-xs border-r ${
          agents.inactive && 'opacity-40'
        }`}
      >
        {agents.email}
      </TableCell>

      <TableCell
        className={`font-mono text-xs font-medium border-r text-center ${
          agents.inactive && 'opacity-40'
        }`}
      >
        {isAdmin || 'MEMBRO'}
      </TableCell>

      <TableCell
        className={`font-mono tracking-tight text-xs truncate max-w-xs border-r text-center ${
          agents.inactive && 'opacity-40'
        }`}
      >
        {inactiveDate}
      </TableCell>

      <TableCell>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={agents.inactive !== null}
              className="rounded flex items-center cursor-pointer disabled:cursor-not-allowed"
            >
              <Pencil className="size-3 text-emerald-600" />
              Alterar
            </Button>
          </DialogTrigger>

          <UpdateAgentDialog agents={agents} onOpenChange={setIsDialogOpen} />
        </Dialog>
      </TableCell>

      <TableCell>
        {agents.inactive === null ? (
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
                <Lock className="size-3 text-rose-600" />
                Revogar
              </Button>
            </DialogTrigger>

            <InactiveAgent
              agents={agents}
              onOpenChange={isSetInactiveDialogOpen}
            />
          </Dialog>
        ) : (
          <Dialog
            open={isActiveDialogOpen}
            onOpenChange={isSetActiveDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded flex items-center cursor-pointer"
              >
                <LockOpen className="size-3 text-green-600" />
                Permitir
              </Button>
            </DialogTrigger>

            <ActiveAgent agents={agents} onOpenChange={isSetActiveDialogOpen} />
          </Dialog>
        )}
      </TableCell>
    </TableRow>
  )
}
