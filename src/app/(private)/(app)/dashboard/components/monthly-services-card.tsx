import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'

export function MonthlyServicesCard() {
  return (
    <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Atendimentos por Mês
        </CardTitle>
        <TrendingUp className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-white font-calsans">456</div>
        <div className="flex items-center pt-1">
          <span
            className={`text-xs font-semibold ${
              Number(100) >= 0 ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {Number(100) >= 0 ? '+' : ''}
            {100}%
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            vs {100} atendimentos em Fevereiro
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
