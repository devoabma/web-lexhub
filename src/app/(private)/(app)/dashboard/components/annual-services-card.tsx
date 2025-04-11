'use client'

import { getAllQuantityServicesYear } from '@/api/dashboard/get-all-quantity-services-year'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'
import { CalendarDays } from 'lucide-react'
import { subYears } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'

export function AnnualServicesCard() {
  const { data: totalServicesYear, isLoading } = useQuery({
    queryKey: ['metrics', 'services-year'],
    queryFn: getAllQuantityServicesYear,
  })

  // Busca o ano passado para comparação de crescimento
  const lastYear = subYears(new Date(), 1).getFullYear()

  // Define valores padrão para evitar erros
  const totalCurrentYear = totalServicesYear?.totalCurrentYear ?? 0
  const totalPreviousYear = totalServicesYear?.totalPreviousYear ?? 0

  // Calcula a variação anual de forma segura
  let variationAnnual = 0
  if (totalPreviousYear > 0) {
    variationAnnual =
      ((totalCurrentYear - totalPreviousYear) / totalPreviousYear) * 100
  } else if (totalCurrentYear > 0) {
    variationAnnual = 100 // Se não houver registros no ano anterior, considera 100% de crescimento
  }

  return (
    <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 hover:border-sky-800 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Atendimentos por Ano
        </CardTitle>
        <CalendarDays className="size-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-10 rounded mb-4" />
        ) : (
          <div className="text-3xl font-calsans text-white">
            {totalCurrentYear.toLocaleString('pt-BR', {
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
              className={`text-xs ${variationAnnual >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
            >
              {variationAnnual >= 0 ? '+' : ''}
              {variationAnnual}%
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              vs {totalPreviousYear} atendimento(s) em {lastYear}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
