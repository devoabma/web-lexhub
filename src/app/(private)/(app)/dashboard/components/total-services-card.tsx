'use client'

import { getAllQuantityPerDay } from '@/api/dashboard/get-all-quantity-per-day'
import { getAllQuantityServices } from '@/api/dashboard/get-all-quantity-services'
import { Skeleton } from '@/components/ui/skeleton'
import { calculateVariation } from '@/utils/calculate-variation'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList } from 'lucide-react'
import {
  MetricCard,
  MetricValue,
  TrendBadge,
  formatMetric,
} from './metric-card'

export function TotalServicesCard() {
  const { data: totalServices, isLoading } = useQuery({
    queryKey: ['metrics', 'services-general'],
    queryFn: getAllQuantityServices,
  })

  const { data: totalServicesDay, isLoading: isLoadingDay } = useQuery({
    queryKey: ['metrics', 'services-day'],
    queryFn: getAllQuantityPerDay,
  })

  const total = totalServices?.total ?? 0 // Garante que seja 0 caso undefined

  const totalDay = totalServicesDay?.totalTheDay ?? 0
  const totalLastDay = totalServicesDay?.totalLastDay ?? 0

  const variationDay = calculateVariation(totalDay, totalLastDay)

  return (
    <MetricCard title="Total de Atendimentos cadastrados" icon={ClipboardList}>
      <MetricValue value={total} isLoading={isLoading} />

      {isLoadingDay ? (
        <Skeleton className="h-5 w-40" />
      ) : (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="text-muted-foreground">Hoje</span>
            <span className="font-medium tabular-nums">
              {formatMetric(totalDay)}
            </span>
            <TrendBadge value={variationDay} />
          </span>
          <span className="text-muted-foreground">
            Ontem{' '}
            <span className="tabular-nums">{formatMetric(totalLastDay)}</span>
          </span>
        </div>
      )}
    </MetricCard>
  )
}
