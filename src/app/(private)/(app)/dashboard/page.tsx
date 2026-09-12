import { getIsAgentAuthenticated } from '@/auth'
import { PageHeader } from '@/components/app/page-header'
import { AnnualServicesCard } from './components/annual-services-card'
import { DailyServicesChart } from './components/daily-services-chart'
import { EmployeeServicesCard } from './components/employee-services-card'
import { GenerateReport } from './components/generate-report'
import { MonthlyServicesCard } from './components/monthly-services-card'
import { PeriodFilter } from './components/period-filter'
import { ServiceChart } from './components/service-chart'
import { TopAgentsCard } from './components/top-agents-card'
import { TopLawyersCard } from './components/top-lawyers-card'
import { TotalServicesCard } from './components/total-services-card'
import { YearlyServicesChart } from './components/yearly-services-chart'

export default async function DashboardPage() {
  const idAgentAuthenticated = await getIsAgentAuthenticated()

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Dashboard"
        description="Visão geral dos atendimentos à advocacia maranhense."
        actions={<GenerateReport />}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <EmployeeServicesCard idAgentAuthenticated={idAgentAuthenticated} />
        <TotalServicesCard />
        <MonthlyServicesCard />
        <AnnualServicesCard />
      </div>

      {/* Os 4 cards acima não dependem do período; só o que está abaixo */}
      <section
        aria-labelledby="period-analysis-title"
        className="flex flex-col gap-3"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-0.5">
            <h2
              id="period-analysis-title"
              className="font-heading font-semibold text-base tracking-tight"
            >
              Análise por período
            </h2>
            <p className="text-[13px] text-muted-foreground">
              Gráficos e rankings do ano e mês selecionados.
            </p>
          </div>

          <PeriodFilter />
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          <ServiceChart className="xl:col-span-2" />
          <YearlyServicesChart />
          <DailyServicesChart className="xl:col-span-3" />
          <TopLawyersCard className="xl:col-span-2" />
          <TopAgentsCard idAgentAuthenticated={idAgentAuthenticated} />
        </div>
      </section>
    </div>
  )
}
