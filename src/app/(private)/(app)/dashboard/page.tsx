import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { CalendarDays, ClipboardList, TrendingUp, Users } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-calsans font-bold tracking-tight">
        Dashboard
      </h1>

      <Separator orientation="horizontal" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total de Atendimentos */}
        <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">
              Total de Atendimentos
            </CardTitle>
            <ClipboardList className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">1246</div>
            <p className="text-xs text-slate-400">
              Todos os atendimentos cadastrados
            </p>
          </CardContent>
        </Card>

        {/* Card 2: Atendimentos por Ano */}
        <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">
              Atendimentos por Ano
            </CardTitle>
            <CalendarDays className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">487</div>
            <div className="flex items-center pt-1">
              <span
                className={`text-xs font-semibold ${
                  Number(100) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {Number(100) >= 0 ? '+' : ''}
                {100}%
              </span>
              <span className="text-xs text-slate-400 ml-2">
                vs 20 atendimentos em 2024
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Atendimentos por Mês */}
        <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">
              Atendimentos por Mês
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-100">456</div>
            <div className="flex items-center pt-1">
              <span
                className={`text-xs font-semibold ${
                  Number(100) >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {Number(100) >= 0 ? '+' : ''}
                {100}%
              </span>
              <span className="text-xs text-slate-400 ml-2">
                vs {100} atendimentos em Fevereiro
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Atendimentos por Funcionário */}
        <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-100">
              Atendimentos por Funcionário
            </CardTitle>
            <Users className="h-5 w-5 text-slate-400" />
          </CardHeader>
          <CardContent>
            <p className="text-base font-semibold text-slate-100 mb-2">
              João Silva
            </p>
            <div className="text-3xl font-bold text-slate-100">324</div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>
                <p className="text-xs font-medium text-slate-400">Março</p>
                <p className="text-sm text-slate-100">120</p>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Fevereiro</p>
                <div className="flex items-center">
                  <span className="text-sm text-slate-100">104</span>
                  <span className="text-xs ml-1 text-green-400">+15.4%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
