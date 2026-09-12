'use client'

import { getServicesDaily } from '@/api/dashboard/get-services-daily'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CHART_HEIGHT,
  axisProps,
  barCursor,
  chartMargin,
  gridProps,
  tooltipStyles,
} from './chart-styles'
import { DashboardPanel } from './dashboard-panel'
import { MONTH_NAMES, useDashboardPeriod } from './use-dashboard-period'

export function DailyServicesChart({ className }: { className?: string }) {
  const period = useDashboardPeriod()

  // Sem mês no seletor, mostra o mês atual dentro do ano selecionado
  const year = period.year
  const month = period.month ?? new Date().getMonth() + 1

  const {
    data: servicesDaily,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['metrics', 'services-daily', year, month],
    queryFn: () => getServicesDaily({ year, month }),
  })

  const monthLabel = `${MONTH_NAMES[month - 1]} de ${year}`

  return (
    <DashboardPanel
      title="Atendimentos por dia"
      description={
        servicesDaily
          ? `${monthLabel} · ${servicesDaily.total} atendimento(s)`
          : monthLabel
      }
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      skeleton={<Skeleton className="h-[240px] w-full" />}
      className={className}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart
          data={servicesDaily?.days}
          style={{ fontSize: 12 }}
          margin={chartMargin}
        >
          <CartesianGrid {...gridProps} />

          <XAxis dataKey="day" {...axisProps} dy={12} />

          <YAxis {...axisProps} width={40} allowDecimals={false} />

          <Tooltip
            cursor={barCursor}
            formatter={value => [value, 'Atendimentos']}
            // 'YYYY-MM-DD' → 'DD/MM/YYYY', sem conversão de fuso
            labelFormatter={(_, payload) =>
              payload?.[0]?.payload.date.split('-').reverse().join('/')
            }
            {...tooltipStyles}
          />

          <Bar
            dataKey="total"
            fill="var(--chart-1)"
            radius={[3, 3, 0, 0]}
            maxBarSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </DashboardPanel>
  )
}
