'use client'

import { getProfile } from '@/api/agents/get-profile'
import { getAllQuantityByAgent } from '@/api/dashboard/get-all-quantity-by-agent'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateVariation } from '@/utils/calculate-variation'
import { useQuery } from '@tanstack/react-query'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Users } from 'lucide-react'
import {
  MetricCard,
  MetricValue,
  TrendBadge,
  formatMetric,
} from './metric-card'

interface EmployeeServicesCardProps {
  idAgentAuthenticated: string | false
}

export function EmployeeServicesCard({
  idAgentAuthenticated,
}: EmployeeServicesCardProps) {
  const { data: totalByAgent, isLoading: isTotalByAgentLoading } = useQuery({
    queryKey: ['metrics', 'services-by-agent', idAgentAuthenticated],
    queryFn: () => getAllQuantityByAgent({ id: idAgentAuthenticated }),
  })

  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['metrics', 'get-profile'],
    queryFn: getProfile,
  })

  // Busca o mês atual
  const currentMonth = format(new Date(), 'MMMM', { locale: ptBR })
  // Capitaliza a primeira letra
  const currentMonthFormatted =
    currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1)

  // Busca o mês passado para comparação de crescimento
  const lastMonth = format(subMonths(new Date(), 1), 'MMMM', { locale: ptBR })
  // Capitaliza a primeira letra
  const lastMonthFormatted =
    lastMonth.charAt(0).toUpperCase() + lastMonth.slice(1)

  // Define valores padrão para evitar erros
  const totalGeneral = totalByAgent?.totalGeneral ?? 0
  const totalCurrentMonth = totalByAgent?.totalOnMonth ?? 0
  const totalPreviousMonth = totalByAgent?.totalOnPreviousMonth ?? 0

  const variationMonth = calculateVariation(
    totalCurrentMonth,
    totalPreviousMonth
  )

  return (
    <MetricCard title="Atendimentos por Funcionário" icon={Users}>
      {isProfileLoading ? (
        <Skeleton className="h-3.5 w-40" />
      ) : (
        <p className="truncate font-medium text-xs">{profile?.agent.name}</p>
      )}

      <MetricValue value={totalGeneral} isLoading={isTotalByAgentLoading} />

      {isTotalByAgentLoading ? (
        <Skeleton className="h-5 w-44" />
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">
              {currentMonthFormatted}
            </span>
            <span className="font-medium tabular-nums">
              {formatMetric(totalCurrentMonth)}
            </span>
            <TrendBadge value={variationMonth} />
          </span>
          <span className="text-muted-foreground">
            {lastMonthFormatted}{' '}
            <span className="tabular-nums">
              {formatMetric(totalPreviousMonth)}
            </span>
          </span>
        </div>
      )}
    </MetricCard>
  )
}
