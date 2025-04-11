'use client'

import { getAllQuantityServicesMonth } from '@/api/dashboard/get-all-quantity-month'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { TrendingUp } from 'lucide-react'
import { subMonths, format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Skeleton } from '@/components/ui/skeleton'

export function MonthlyServicesCard() {
  const { data: totalServicesMonth, isLoading } = useQuery({
    queryKey: ['metrics', 'services-month'],
    queryFn: getAllQuantityServicesMonth,
  })

  // Busca o mês passado para comparação de crescimento
  const lastMonth = format(subMonths(new Date(), 1), 'MMMM', { locale: ptBR })

  // Capitaliza a primeira letra
  const lastMonthFormatted =
    lastMonth.charAt(0).toUpperCase() + lastMonth.slice(1)

  // Define valores padrão para evitar erros
  const totalCurrentMonth = totalServicesMonth?.totalCurrentMonth ?? 0
  const totalPreviousMonth = totalServicesMonth?.totalPreviousMonth ?? 0

  // Calcula a variação do mês de forma segura
  let variationMonth = 0
  if (totalPreviousMonth > 0) {
    variationMonth =
      ((totalCurrentMonth - totalPreviousMonth) / totalPreviousMonth) * 100
  } else if (totalCurrentMonth > 0) {
    variationMonth = 100 // Se não houver registros no mẽs anterior, considera 100% de crescimento
  }

  return (
    <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 hover:border-sky-800 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Atendimentos por Mês
        </CardTitle>
        <TrendingUp className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-10 rounded mb-4" />
        ) : (
          <div className="text-3xl font-bold text-white font-calsans">
            {totalCurrentMonth.toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-4 w-64 rounded-full" />
        ) : (
          <div className="flex items-baseline pt-1">
            <span
              className={`text-xs ${variationMonth >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
            >
              {variationMonth >= 0 ? '+' : ''}
              {variationMonth}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              vs {totalPreviousMonth} atendimento(s) em {lastMonthFormatted}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
