'use client'

import { RoleBadge } from '@/components/app/role-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge, BadgeDot } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { TableCell, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { format, formatDistanceToNow, isValid, parseISO } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Lock, LockOpen, MoreHorizontal, Pencil } from 'lucide-react'
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

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function AgentStatus({ inactive }: { inactive: string | null }) {
  if (!inactive) {
    return (
      <Badge variant="success">
        <BadgeDot />
        Ativo
      </Badge>
    )
  }

  const inactiveSince = parseISO(inactive)

  return (
    <div className="flex items-center gap-2">
      <Badge variant="neutral">
        <BadgeDot />
        Inativo
      </Badge>
      {isValid(inactiveSince) && (
        <span
          className="text-muted-foreground text-xs"
          title={format(inactiveSince, "dd/MM/yyyy 'às' HH:mm")}
        >
          há {formatDistanceToNow(inactiveSince, { locale: ptBR })}
        </span>
      )}
    </div>
  )
}

export function AgentTableRow({ agents }: AgentTableRowProps) {
  // Controle dos dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isInactiveDialogOpen, isSetInactiveDialogOpen] = useState(false)
  const [isActiveDialogOpen, isSetActiveDialogOpen] = useState(false)

  const isInactive = agents.inactive !== null

  return (
    <TableRow className={cn(isInactive && 'bg-muted/20')}>
      <TableCell>
        <div className="flex max-w-72 items-center gap-2.5 sm:max-w-md">
          <Avatar className="size-7 border">
            <AvatarFallback
              className={cn(
                'font-semibold text-[10px]',
                isInactive
                  ? 'bg-muted text-muted-foreground'
                  : 'bg-primary/10 text-primary'
              )}
            >
              {getInitials(agents.name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex min-w-0 flex-col">
            <span
              className={cn(
                'truncate font-medium',
                isInactive && 'text-muted-foreground'
              )}
            >
              {agents.name}
            </span>
            <span className="truncate text-muted-foreground text-xs">
              {agents.email}
            </span>

            {/* Em telas estreitas as colunas de cargo/situação somem e os badges vêm para cá */}
            <div className="mt-1 flex flex-wrap items-center gap-1.5 md:hidden">
              <RoleBadge role={agents.role} />
              <span className="sm:hidden">
                <AgentStatus inactive={agents.inactive} />
              </span>
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <RoleBadge role={agents.role} />
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <AgentStatus inactive={agents.inactive} />
      </TableCell>

      <TableCell className="text-right">
        {/* modal={false}: o menu fecha antes de o diálogo abrir, sem disputa de foco */}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Ações para ${agents.name}`}
              className="text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              disabled={isInactive}
              onSelect={() => setIsDialogOpen(true)}
            >
              <Pencil />
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {isInactive ? (
              <DropdownMenuItem onSelect={() => isSetActiveDialogOpen(true)}>
                <LockOpen />
                Restaurar acesso
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => isSetInactiveDialogOpen(true)}
              >
                <Lock />
                Revogar acesso
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <UpdateAgentDialog agents={agents} onOpenChange={setIsDialogOpen} />
        </Dialog>

        <Dialog
          open={isInactiveDialogOpen}
          onOpenChange={isSetInactiveDialogOpen}
        >
          <InactiveAgent
            agents={agents}
            onOpenChange={isSetInactiveDialogOpen}
          />
        </Dialog>

        <Dialog open={isActiveDialogOpen} onOpenChange={isSetActiveDialogOpen}>
          <ActiveAgent agents={agents} onOpenChange={isSetActiveDialogOpen} />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
