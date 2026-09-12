'use client'

import AssistanceBadge from '@/components/app/assistance-badge'
import { ServiceStatusBadge } from '@/components/app/service-status-badge'
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
import { formatFullName } from '@/utils/format-full-name'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CircleCheck, CircleX, Eye, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { CancelService } from './cancel-service'
import { FinishedService } from './finished-service'
import { ServiceDetails } from './service-details'

interface ServiceTableRowProps {
  services: {
    id: string
    assistance: 'PERSONALLY' | 'REMOTE'
    observation: string | null
    status: 'OPEN' | 'COMPLETED'
    createdAt: string
    finishedAt: string | null
    lawyer: {
      id: string
      name: string
      oab: string
      email: string
    }
    agent: {
      id: string
      name: string
      email: string
      role: 'ADMIN' | 'MEMBER'
    }
    serviceTypes: {
      serviceType: {
        id: string
        name: string
      }
    }[]
  }
  idAgentAuthenticated: string | false
  isAgentAdmin: boolean
}

export function ServiceTableRow({
  services,
  idAgentAuthenticated,
  isAgentAdmin,
}: ServiceTableRowProps) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isFinishedDialogOpen, setIsFinishedDialogOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  // Só quem registrou o atendimento ou um administrador pode concluir/cancelar
  const employeeService = services.agent.id === idAgentAuthenticated
  const canManage = employeeService || isAgentAdmin
  const isOpen = services.status === 'OPEN'

  // Em andamento: tempo desde a abertura. Concluído: desde a conclusão.
  const referenceDate = new Date(
    isOpen || !services.finishedAt ? services.createdAt : services.finishedAt
  )

  return (
    <TableRow>
      <TableCell>
        <div className="flex max-w-60 flex-col sm:max-w-80">
          <button
            type="button"
            onClick={() => setIsDetailsOpen(true)}
            className="truncate rounded-sm text-left font-medium underline-offset-4 outline-none hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {formatFullName(services.lawyer.name)}
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono text-muted-foreground text-xs">
              OAB {services.lawyer.oab}
            </span>
            {/* No celular a coluna de status some e o badge vem para cá */}
            <span className="sm:hidden">
              <ServiceStatusBadge status={services.status} />
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="hidden sm:table-cell">
        <ServiceStatusBadge status={services.status} />
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <AssistanceBadge type={services.assistance} />
      </TableCell>

      <TableCell className="hidden max-w-56 truncate text-muted-foreground lg:table-cell">
        {services.agent.name}
      </TableCell>

      <TableCell className="hidden text-muted-foreground lg:table-cell">
        <time
          dateTime={referenceDate.toISOString()}
          title={format(referenceDate, "dd/MM/yyyy 'às' HH:mm")}
        >
          {formatDistanceToNow(referenceDate, {
            addSuffix: true,
            locale: ptBR,
          })}
        </time>
      </TableCell>

      <TableCell>
        <div className="flex items-center justify-end gap-1">
          {isOpen && (
            <Button
              variant="outline"
              size="sm"
              disabled={!canManage}
              onClick={() => setIsFinishedDialogOpen(true)}
              title="Concluir"
            >
              <CircleCheck className="text-success" />
              {/* No celular fica só o ícone; o rótulo continua para leitores de tela */}
              <span className="sr-only sm:not-sr-only">Concluir</span>
            </Button>
          )}

          {/* modal={false}: o menu fecha antes de o diálogo abrir, sem disputa de foco */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Mais ações do atendimento"
                className="text-muted-foreground data-[state=open]:bg-accent data-[state=open]:text-foreground"
              >
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuItem onSelect={() => setIsDetailsOpen(true)}>
                <Eye />
                Ver detalhes
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                disabled={!canManage || !isOpen}
                onSelect={() => setIsCancelDialogOpen(true)}
              >
                <CircleX />
                Cancelar atendimento
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          {/* FIXME: Componente de Detalhes do Atendimento */}
          <ServiceDetails services={services} />
        </Dialog>

        <Dialog
          open={isFinishedDialogOpen}
          onOpenChange={setIsFinishedDialogOpen}
        >
          {/* FIXME: Componente de Concluir Atendimento */}
          <FinishedService
            services={services}
            onOpenChange={setIsFinishedDialogOpen}
          />
        </Dialog>

        <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
          {/* FIXME: Componente de Cancelar Atendimento */}
          <CancelService
            services={services}
            onOpenChange={setIsCancelDialogOpen}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
