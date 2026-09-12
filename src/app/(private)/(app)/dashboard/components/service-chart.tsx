'use client'

import { getServicesMonthly } from '@/api/dashboard/get-services-monthly'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  CHART_HEIGHT,
  axisProps,
  chartMargin,
  gridProps,
  tooltipStyles,
} from './chart-styles'
import { DashboardPanel } from './dashboard-panel'
import { MONTH_NAMES, useDashboardPeriod } from './use-dashboard-period'

export function ServiceChart({ className }: { className?: string }) {
  const { year, month } = useDashboardPeriod()

  const {
    data: servicesMonthly,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['metrics', 'services-monthly', year],
    queryFn: () => getServicesMonthly({ year }),
  })

  // Rótulo ('Jan'..'Dez') do mês selecionado, marcado no gráfico
  const selectedMonthLabel = servicesMonthly?.months.find(
    item => item.month === month
  )?.label

  return (
    <DashboardPanel
      title="Atendimentos por mês"
      description={
        servicesMonthly
          ? `Ano de ${year} · ${servicesMonthly.total} atendimento(s)`
          : `Ano de ${year}`
      }
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      skeleton={<Skeleton className="h-[240px] w-full" />}
      className={className}
    >
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <LineChart
          data={servicesMonthly?.months}
          style={{ fontSize: 12 }}
          margin={chartMargin}
        >
          <YAxis {...axisProps} width={40} allowDecimals={false} />

          <XAxis dataKey="label" {...axisProps} dy={12} />

          <CartesianGrid {...gridProps} />

          {selectedMonthLabel && (
            <ReferenceLine
              x={selectedMonthLabel}
              stroke="var(--brand-red)"
              strokeDasharray="4 4"
            />
          )}

          <Tooltip
            cursor={{ stroke: 'var(--border)' }}
            formatter={value => [value, 'Atendimentos']}
            labelFormatter={(label, payload) => {
              const monthNumber = payload?.[0]?.payload.month

              return monthNumber
                ? `${MONTH_NAMES[monthNumber - 1]} de ${year}`
                : label
            }}
            {...tooltipStyles}
          />

          <Line
            type="linear"
            dataKey="total"
            stroke="var(--chart-1)"
            strokeWidth={2}
            dot={{ r: 3, fill: 'var(--chart-1)' }}
            activeDot={{ r: 5, stroke: 'var(--brand-red)' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </DashboardPanel>
  )
}
