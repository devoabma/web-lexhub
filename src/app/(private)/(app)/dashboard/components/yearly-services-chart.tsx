'use client'

import { getServicesYearly } from '@/api/dashboard/get-services-yearly'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { CalendarX } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
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
import { DashboardPanel, PanelMessage } from './dashboard-panel'
import { useDashboardPeriod } from './use-dashboard-period'

export function YearlyServicesChart({ className }: { className?: string }) {
  const { year } = useDashboardPeriod()

  const {
    data: servicesYearly,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['metrics', 'services-yearly'],
    queryFn: getServicesYearly,
  })

  const years = servicesYearly?.years ?? []
  const firstYear = years[0]?.year
  const lastYear = years[years.length - 1]?.year

  // Com um ano só na série, não há o que destacar
  let description = 'Todos os anos com atendimentos'
  if (firstYear && lastYear && firstYear !== lastYear) {
    description = `De ${firstYear} a ${lastYear} · ${year} em destaque`
  } else if (firstYear) {
    description = `Atendimentos desde ${firstYear}`
  }

  return (
    <DashboardPanel
      title="Atendimentos por ano"
      description={description}
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      skeleton={<Skeleton className="h-[240px] w-full" />}
      className={className}
    >
      {years.length === 0 ? (
        <PanelMessage icon={CalendarX} title="Nenhum atendimento registrado." />
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <BarChart data={years} style={{ fontSize: 12 }} margin={chartMargin}>
            <CartesianGrid {...gridProps} />

            <XAxis dataKey="year" {...axisProps} dy={12} />

            <YAxis {...axisProps} width={40} allowDecimals={false} />

            <Tooltip
              cursor={barCursor}
              formatter={value => [value, 'Atendimentos']}
              {...tooltipStyles}
            />

            <Bar dataKey="total" radius={[4, 4, 0, 0]} maxBarSize={48}>
              {years.map(item => (
                <Cell
                  key={item.year}
                  fill="var(--chart-1)"
                  // Mesma cor para todos; o ano selecionado fica opaco
                  fillOpacity={item.year === year ? 1 : 0.35}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </DashboardPanel>
  )
}
