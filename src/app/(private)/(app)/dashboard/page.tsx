import { Separator } from '@/components/ui/separator'
import { AnnualServicesCard } from './components/annual-services-card'
import { EmployeeServicesCard } from './components/employee-services-card'
import { MonthlyServicesCard } from './components/monthly-services-card'
import { ServiceChart } from './components/service-chart'
import { TotalServicesCard } from './components/total-services-card'
import { getIsAgentAuthenticated } from '@/auth'

export default async function DashboardPage() {
  const idAgentAuthenticated = await getIsAgentAuthenticated()

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-calsans font-bold tracking-tight">
        Dashboard
      </h1>

      <Separator orientation="horizontal" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <EmployeeServicesCard idAgentAuthenticated={idAgentAuthenticated} />
        <TotalServicesCard />
        <MonthlyServicesCard />
        <AnnualServicesCard />
      </div>

      <div className="grid grid-cols-9 gap-4">
        <ServiceChart />
      </div>
    </div>
  )
}
