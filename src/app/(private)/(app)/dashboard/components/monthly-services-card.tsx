'use client'

import { getAllQuantityServicesMonth } from '@/api/dashboard/get-all-quantity-month'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateVariation } from '@/utils/calculate-variation'
import { useQuery } from '@tanstack/react-query'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { CalendarRange } from 'lucide-react'
import { MetricCard, MetricValue, TrendBadge } from './metric-card'

export function MonthlyServicesCard() {
  const { data: totalServicesMonth, isLoading } = useQuery({
    queryKey: ['metrics', 'services-month'],
    queryFn: getAllQuantityServicesMonth,
  })

  // Busca o mês passado para comparação de crescimento
  const lastMonth = format(subMonths(new Date(), 1), 'MMMM', { locale: ptBR })

  // Capitaliza a primeira letra
  const lastMonthFormatted =
    lastMonth.charAt(0).toUpperCase() + lastMonth.slice(1)

  // Define valores padrão para evitar erros
  const totalCurrentMonth = totalServicesMonth?.totalCurrentMonth ?? 0
  const totalPreviousMonth = totalServicesMonth?.totalPreviousMonth ?? 0

  const variationMonth = calculateVariation(
    totalCurrentMonth,
    totalPreviousMonth
  )

  return (
    <MetricCard title="Atendimentos por Mês" icon={CalendarRange}>
      <MetricValue value={totalCurrentMonth} isLoading={isLoading} />

      {isLoading ? (
        <Skeleton className="h-5 w-48" />
      ) : (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <TrendBadge value={variationMonth} />
          <span className="text-muted-foreground">
            vs {totalPreviousMonth} atendimento(s) em {lastMonthFormatted}
          </span>
        </div>
      )}
    </MetricCard>
  )
}
