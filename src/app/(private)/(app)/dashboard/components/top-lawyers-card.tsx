'use client'

import { getTopLawyers } from '@/api/dashboard/get-top-lawyers'
import { formatFullName } from '@/utils/format-full-name'
import { useQuery } from '@tanstack/react-query'
import { CalendarX } from 'lucide-react'
import { DashboardPanel, PanelMessage } from './dashboard-panel'
import { RankingList, RankingSkeleton } from './ranking-list'
import { formatPeriod, useDashboardPeriod } from './use-dashboard-period'

export function TopLawyersCard({ className }: { className?: string }) {
  const { year, month } = useDashboardPeriod()

  const {
    data: topLawyers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['metrics', 'top-lawyers', { year, month }],
    queryFn: () => getTopLawyers({ year, month, limit: 10 }),
  })

  const periodLabel = formatPeriod({ year, month })

  return (
    <DashboardPanel
      title="Top 10 advogados(as) mais atendidos(as)"
      description={
        topLawyers
          ? `${periodLabel} · % sobre ${topLawyers.servicesInPeriod} atendimento(s) no período`
          : periodLabel
      }
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      skeleton={<RankingSkeleton rows={10} withDetail />}
      className={className}
    >
      {topLawyers?.lawyers.length ? (
        <RankingList
          label="Advogados(as) mais atendidos(as)"
          servicesInPeriod={topLawyers.servicesInPeriod}
          items={topLawyers.lawyers.map(lawyer => ({
            id: lawyer.id,
            name: formatFullName(lawyer.name),
            detail: `OAB ${lawyer.oab}`,
            total: lawyer.total,
          }))}
        />
      ) : (
        <PanelMessage
          icon={CalendarX}
          title="Nenhum atendimento no período."
          description="Escolha outro ano ou mês no seletor de período."
        />
      )}
    </DashboardPanel>
  )
}
