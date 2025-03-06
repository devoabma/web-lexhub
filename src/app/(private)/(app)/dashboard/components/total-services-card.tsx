import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClipboardList } from 'lucide-react'

export function TotalServicesCard() {
  return (
    <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Total de Atendimentos
        </CardTitle>
        <ClipboardList className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold font-calsans text-white">1246</div>
        <p className="text-xs text-muyted-foreground">
          Total de atendimentos cadastrados
        </p>
      </CardContent>
    </Card>
  )
}
