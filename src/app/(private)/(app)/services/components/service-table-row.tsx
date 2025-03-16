'use client'

import AssistanceBadge from '@/components/app/assistance-badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatFullName } from '@/utils/format-full-name'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CheckCircle, CircleX, Search } from 'lucide-react'
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
      cpf: string
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
}

export function ServiceTableRow({ services }: ServiceTableRowProps) {
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
              <Search className="size-3.5" />
              <span className="sr-only">Detalhes do atendimento</span>
            </Button>
          </DialogTrigger>

          {/* FIXME: Componente de Detalhes do Atendimento */}
          <ServiceDetails services={services} />
        </Dialog>
      </TableCell>

      <TableCell className="border-r">
        {services.status === 'OPEN' ? (
          <div className="flex items-center justify-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium">Em andamento</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <span className="block h-2 w-2 rounded-full bg-rose-500" />
            <span className="text-xs font-medium">Concluído</span>
          </div>
        )}
      </TableCell>

      <TableCell className="text-center border-r">
        {formatDistanceToNow(new Date(services.createdAt), {
          addSuffix: true,
          locale: ptBR,
        })}
      </TableCell>

      <TableCell className="font-mono text-xs font-medium text-center border-r">
        <AssistanceBadge type={services.assistance} />
      </TableCell>

      <TableCell className="font-mono text-xs font-medium text-center border-r">
        {services.lawyer.oab}
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        {formatFullName(services.lawyer.name)}
      </TableCell>

      <TableCell className="font-medium truncate max-w-xs border-r">
        {services.agent.name}
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
