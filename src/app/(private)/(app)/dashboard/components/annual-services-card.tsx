'use client'

import { getAllQuantityServicesYear } from '@/api/dashboard/get-all-quantity-services-year'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateVariation } from '@/utils/calculate-variation'
import { useQuery } from '@tanstack/react-query'
import { subYears } from 'date-fns'
import { CalendarDays } from 'lucide-react'
import { MetricCard, MetricValue, TrendBadge } from './metric-card'

export function AnnualServicesCard() {
  const { data: totalServicesYear, isLoading } = useQuery({
    queryKey: ['metrics', 'services-year'],
    queryFn: getAllQuantityServicesYear,
  })

  // Busca o ano passado para comparação de crescimento
  const lastYear = subYears(new Date(), 1).getFullYear()

  // Define valores padrão para evitar erros
  const totalCurrentYear = totalServicesYear?.totalCurrentYear ?? 0
  const totalPreviousYear = totalServicesYear?.totalPreviousYear ?? 0

  const variationAnnual = calculateVariation(
    totalCurrentYear,
    totalPreviousYear
  )

  return (
    <MetricCard title="Atendimentos por Ano" icon={CalendarDays}>
      <MetricValue value={totalCurrentYear} isLoading={isLoading} />

      {isLoading ? (
        <Skeleton className="h-5 w-48" />
      ) : (
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <TrendBadge value={variationAnnual} />
          <span className="text-muted-foreground">
            vs {totalPreviousYear} atendimento(s) em {lastYear}
          </span>
        </div>
      )}
    </MetricCard>
  )
}
