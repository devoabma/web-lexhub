import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarDays } from 'lucide-react'

export function AnnualServicesCard() {
  return (
    <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Atendimentos por Ano
        </CardTitle>
        <CalendarDays className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-calsans text-white">487</div>
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
            vs 20 atendimentos em 2024
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
