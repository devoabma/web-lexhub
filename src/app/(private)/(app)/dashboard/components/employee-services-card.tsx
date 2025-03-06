import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'

export function EmployeeServicesCard() {
  return (
    <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Atendimentos por Funcionário
        </CardTitle>
        <Users className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <p className="text-base font-semibold text-white mb-2">
          Hilquias Ferreira Melo
        </p>
        <div className="text-3xl font-bold text-white font-calsans">324</div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Março</p>
            <p className="text-sm text-white">120</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              Fevereiro
            </p>
            <div className="flex items-center">
              <span className="text-sm text-white">104</span>
              <span className="text-xs ml-1 text-green-400">+15.4%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
