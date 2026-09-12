'use client'

import AssistanceBadge from '@/components/app/assistance-badge'
import { CopyContentField } from '@/components/app/copy-content-field'
import { RoleBadge } from '@/components/app/role-badge'
import { ServiceStatusBadge } from '@/components/app/service-status-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { calculateDurationService } from '@/utils/calculate-duration-service'
import { formatFullName } from '@/utils/format-full-name'
import { format } from 'date-fns'
import {
  CalendarCheck,
  CalendarPlus,
  type LucideIcon,
  Mail,
  MailX,
  Timer,
} from 'lucide-react'
import type * as React from 'react'

interface ServiceDetailsProps {
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
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
      {children}
    </p>
  )
}

function Person({
  label,
  name,
  children,
}: {
  label: string
  name: string
  children: React.ReactNode
}) {
  return (
    <div className="min-w-0 space-y-2 rounded-md border bg-muted/30 p-3">
      <SectionLabel>{label}</SectionLabel>
      <div className="flex items-start gap-3">
        <Avatar className="size-8 border">
          <AvatarFallback className="font-medium text-[11px]">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 space-y-0.5">{children}</div>
      </div>
    </div>
  )
}

function TimelineItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
      <span className="text-muted-foreground">{label}:</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  )
}

export function ServiceDetails({ services }: ServiceDetailsProps) {
  // Formatação de datas
  const formattedCreatedAt = format(services.createdAt, "dd/MM/yyyy 'às' HH:mm")
  const formattedFinishedAt = services.finishedAt
    ? format(services.finishedAt, "dd/MM/yyyy 'às' HH:mm")
    : ''

  // Calcula duração do atendimento em horas
  const durationService = calculateDurationService({
    createdAt: services.createdAt,
    finishedAt: services.finishedAt,
  })

  const hasObservation = Boolean(services.observation)

  return (
    <DialogContent className="gap-0 p-0 sm:max-w-xl md:max-w-2xl">
      <DialogHeader className="gap-2 border-b px-5 py-4 pr-12 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <DialogTitle>Detalhes do Atendimento</DialogTitle>
          <ServiceStatusBadge status={services.status} />
        </div>
        <DialogDescription className="flex items-center gap-1 font-mono text-xs">
          <span className="truncate">ID: {services.id}</span>
          <CopyContentField value={services.id} label="Copiar ID" />
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4 px-5 py-4">
        {/* Tipos de serviço e forma de atendimento */}
        <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="space-y-2">
            <SectionLabel>Tipo de Serviço</SectionLabel>
            <div className="flex flex-wrap gap-1.5">
              {services.serviceTypes.map(data => (
                <Badge
                  key={data.serviceType.id}
                  variant="neutral"
                  className="text-foreground"
                >
                  {data.serviceType.name}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <SectionLabel>Atendimento</SectionLabel>
            <AssistanceBadge type={services.assistance} />
          </div>
        </div>

        {/* Advogado(a) e funcionário(a) */}
        <div className="grid gap-3 md:grid-cols-2">
          <Person label="Advogado(a)" name={services.lawyer.name}>
            <p className="truncate font-medium">
              {formatFullName(services.lawyer.name)}
            </p>
            <p className="font-mono text-muted-foreground text-xs">
              OAB: {services.lawyer.oab}
            </p>
            <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
              {services.lawyer.email ? (
                <Mail className="size-3 shrink-0" />
              ) : (
                <MailX className="size-3 shrink-0" />
              )}
              <span className="truncate">
                {services.lawyer.email
                  ? services.lawyer.email
                  : 'Sem e-mail cadastrado'}
              </span>
            </p>
          </Person>

          <Person label="Funcionário(a)" name={services.agent.name}>
            <p className="truncate font-medium">{services.agent.name}</p>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <span className="sr-only">Função:</span>
              <RoleBadge role={services.agent.role} />
            </div>
            <p className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Mail className="size-3 shrink-0" />
              <span className="truncate">{services.agent.email}</span>
            </p>
          </Person>
        </div>

        {/* Observação */}
        <div className="space-y-2">
          <SectionLabel>Observação</SectionLabel>
          <p
            className={`whitespace-pre-line rounded-md border bg-muted/30 px-3 py-2 ${hasObservation ? '' : 'text-muted-foreground italic'}`}
          >
            {hasObservation
              ? services.observation
              : 'Nenhuma observação adicionada'}
          </p>
        </div>
      </div>

      <DialogFooter className="flex-col items-stretch gap-3 border-t px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1 text-xs">
          <TimelineItem
            icon={CalendarPlus}
            label="Criado em"
            value={formattedCreatedAt}
          />

          {services.status === 'COMPLETED' && (
            <>
              <TimelineItem
                icon={CalendarCheck}
                label="Finalizado em"
                value={formattedFinishedAt}
              />
              <TimelineItem
                icon={Timer}
                label="Duração total"
                value={durationService}
              />
            </>
          )}
        </div>

        <DialogClose asChild>
          <Button variant="outline">Fechar</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
