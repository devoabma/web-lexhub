'use client'

import { getTopAgents } from '@/api/dashboard/get-top-agents'
import { useQuery } from '@tanstack/react-query'
import { CalendarX } from 'lucide-react'
import { DashboardPanel, PanelMessage } from './dashboard-panel'
import { RankingList, RankingSkeleton } from './ranking-list'
import { formatPeriod, useDashboardPeriod } from './use-dashboard-period'

interface TopAgentsCardProps {
  idAgentAuthenticated: string | false
  className?: string
}

export function TopAgentsCard({
  idAgentAuthenticated,
  className,
}: TopAgentsCardProps) {
  const { year, month } = useDashboardPeriod()

  const {
    data: topAgents,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['metrics', 'top-agents', { year, month }],
    queryFn: () => getTopAgents({ year, month, limit: 3 }),
  })

  const periodLabel = formatPeriod({ year, month })

  return (
    <DashboardPanel
      title="Top 3 funcionários(as) que mais atenderam"
      description={
        topAgents
          ? `${periodLabel} · % sobre ${topAgents.servicesInPeriod} atendimento(s) no período`
          : periodLabel
      }
      isLoading={isLoading}
      isError={isError}
      onRetry={() => refetch()}
      skeleton={<RankingSkeleton rows={3} />}
      className={className}
    >
      {topAgents?.agents.length ? (
        <RankingList
          label="Funcionários(as) que mais atenderam"
          servicesInPeriod={topAgents.servicesInPeriod}
          items={topAgents.agents.map(agent => ({
            id: agent.id,
            name: agent.name,
            total: agent.total,
            // Destaca o funcionário logado (sub do JWT), se estiver no ranking
            isHighlighted: agent.id === idAgentAuthenticated,
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
