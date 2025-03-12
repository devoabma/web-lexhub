'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Edit3, Lock, LockOpen } from 'lucide-react'
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

  const isAdmin = agents.role === 'ADMIN'

  // Formata a data de inatividade se for válida
  const inactiveDate = agents.inactive ? (
    (() => {
      const data = parseISO(agents.inactive)
      return (
        isValid(data) &&
        `Inativo há ${formatDistanceToNow(data, { locale: ptBR })}`
      )
    })()
  ) : (
    <>
      <Badge className="bg-emerald-700 text-white font-bold rounded-full gap-1.5 px-3 py-1">
        <span className="relative flex size-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full size-2 bg-white" />
        </span>
        ATIVO
      </Badge>
    </>
  )

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
        {isAdmin ? (
          <Badge className="bg-indigo-900 rounded-full text-white font-bold gap-1.5 px-3 py-1">
            ADMINISTRADOR
          </Badge>
        ) : (
          <Badge className="bg-blue-700 rounded-full text-white font-bold gap-1.5 px-3 py-1">
            MEMBRO
          </Badge>
        )}
      </TableCell>

      <TableCell
        className={`font-mono tracking-tight text-xs truncate max-w-xs border-r text-center ${
          agents.inactive && 'opacity-40'
        }`}
      >
        {inactiveDate}
      </TableCell>

      <TableCell className="flex items-center gap-2">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              disabled={agents.inactive !== null}
              className="rounded flex items-center gap-2 cursor-pointer group hover:border-emerald-500 transition-colors disabled:cursor-not-allowed"
            >
              <Edit3 className="size-3.5 group-hover:text-emerald-500" />
              Alterar
            </Button>
          </DialogTrigger>

          <UpdateAgentDialog agents={agents} onOpenChange={setIsDialogOpen} />
        </Dialog>

        {agents.inactive === null ? (
          <Dialog
            open={isInactiveDialogOpen}
            onOpenChange={isSetInactiveDialogOpen}
          >
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded flex items-center gap-2 cursor-pointer"
              >
                <Lock className="size-3.5 text-rose-600" />
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
                className="rounded flex items-center gap-2 cursor-pointer"
              >
                <LockOpen className="size-3.5 text-green-600" />
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
