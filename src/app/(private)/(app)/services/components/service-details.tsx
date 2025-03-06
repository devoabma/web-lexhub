'use client'

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
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import {
  CheckCircle,
  Clock,
  FileText,
  Monitor,
  User,
  UserCog,
} from 'lucide-react'

// Service data
const service = {
  id: '3b791653-6b9a-4d4c-ac25-0c5c458d0216',
  assistance: 'PERSONALLY',
  observation: 'Observação do atendimento',
  status: 'COMPLETED',
  createdAt: new Date('2025-02-23T19:40:53.425Z'),
  finishedAt: new Date('2025-02-23T22:46:33.082Z') || null,
  lawyer: {
    id: '0b21929e-16ba-4697-9f60-39e1adda88d6',
    name: 'DALENE FERREIRA MELO DOS SANTOS',
    cpf: '60519864301',
    oab: '22158',
    email: 'dalenefmeloadv@gmail.com',
  },
  agent: {
    id: '0d64b983-894a-4532-9f1a-23e2a06c4f12',
    name: 'Hilquias Ferreira Melo',
    email: 'hilquiasfmelo@gmail.com',
    role: 'ADMIN',
  },
  serviceTypes: [
    {
      serviceType: {
        id: 'cm79sstmi0000i3m028engmfh',
        name: 'Instalação e configuração total para usar o PJE',
      },
    },
    {
      serviceType: {
        id: 'cm79sstmi0000i3m028engmfg',
        name: 'Instalação e configuração total para usar o SEEU',
      },
    },
  ],
}

export function ServiceDetails() {
  // Formatação de datas
  const formattedCreatedAt = format(service.createdAt, "dd/MM/yyyy 'às' HH:mm")
  const formattedFinishedAt = service.finishedAt
    ? format(service.finishedAt, "dd/MM/yyyy 'às' HH:mm")
    : ''

  // Calcula duração do atendimento em horas
  const durationMs = service.finishedAt.getTime() - service.createdAt.getTime()
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  const durationText = `${hours}h ${minutes}min`

  return (
    <DialogContent className="mx-auto w-[90%] rounded">
      <DialogHeader className="mt-4">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl font-calsans font-bold">
            Detalhes do Atendimento
          </DialogTitle>
          <Badge
            variant={service.status === 'COMPLETED' ? 'closed' : 'open'}
            className="ml-2 rounded-full"
          >
            {service.status === 'COMPLETED' ? 'Finalizado' : 'Em andamento'}
          </Badge>
        </div>
        <DialogDescription className="font-mono tracking-tight">
          ID: {service.id}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-2">
        {/* Service Type Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>Tipo de Serviço</span>
          </div>
          <div className="pl-6">
            <ul className="list-disc list-inside space-y-1 font-medium text-muted-foreground">
              {service.serviceTypes.map(serviceType => (
                <li key={serviceType.serviceType.id} className="text-sm">
                  {serviceType.serviceType.name}
                </li>
              ))}
            </ul>

            <p className="text-sm flex items-center gap-2 mt-2 text-muted-foreground">
              <Monitor className="size-4" />
              Atendimento:{' '}
              {service.assistance === 'PERSONALLY' ? 'Presencial' : 'Remoto'}
            </p>
          </div>
        </div>

        <Separator />

        {/* Seção do Advogado */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <User className="size-4" />
            <span>Advogado(a)</span>
          </div>
          <div className="flex items-center gap-4 pl-6">
            <Avatar className="size-12 border">
              <AvatarFallback>
                {service.lawyer.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{service.lawyer.name}</p>
              <p className="text-sm text-muted-foreground">
                OAB: {service.lawyer.oab}
              </p>
              <p className="text-sm text-muted-foreground">
                {service.lawyer.email}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Seção do Funcionário */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <UserCog className="size-4" />
            <span>Funcionário(a)</span>
          </div>
          <div className="flex items-center gap-4 pl-6">
            <Avatar className="size-12 border">
              <AvatarFallback>
                {service.agent.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{service.agent.name}</p>
              <p className="text-sm text-muted-foreground">
                Função:{' '}
                {service.agent.role === 'ADMIN' ? 'Administrador' : 'Membro'}
              </p>
              <p className="text-sm text-muted-foreground">
                {service.agent.email}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Seção da Observação */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <FileText className="size-4" />
            <span>Observação</span>
          </div>
          <div className="pl-6 bg-muted/50 p-3 rounded">
            <p className="text-sm">
              {service.observation === ''
                ? 'Nenhuma observação informada.'
                : service.observation}
            </p>
          </div>
        </div>
      </div>

      <DialogFooter className="flex flex-col space-y-2 pt-2 border-t">
        <div className="flex flex-col w-full text-sm gap-2">
          <div className="flex items-center gap-1">
            <Clock className="size-4 text-muted-foreground" />
            <span className="text-muted-foreground">Criado em:</span>
            <span className="font-medium">{formattedCreatedAt}</span>
          </div>

          {service.status === 'COMPLETED' && (
            <>
              <div className="flex items-center gap-1">
                <CheckCircle className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Finalizado em:</span>
                <span className="font-medium">{formattedFinishedAt}</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="size-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duração total:</span>
                <span className="font-medium ml-1">{durationText}</span>
              </div>
            </>
          )}

          <DialogClose asChild>
            <Button className="w-full mt-2 rounded bg-sky-700 hover:bg-sky-600 text-white cursor-pointer">
              Fechar
            </Button>
          </DialogClose>
        </div>
      </DialogFooter>
    </DialogContent>
  )
}
