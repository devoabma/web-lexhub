'use client'

import { getAllQuantityServices } from '@/api/dashboard/get-all-quantity-services'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { ClipboardList } from 'lucide-react'

export function TotalServicesCard() {
  const { data: totalServices, isLoading } = useQuery({
    queryKey: ['metrics', 'services-general'],
    queryFn: getAllQuantityServices,
  })

  const total = totalServices?.total ?? 0 // Garante que seja 0 caso undefined

  return (
    <Card className="rounded-2xl shadow-2xl backdrop-blur-lg bg-slate-800/60 border border-slate-700 transition-transform transform hover:scale-105">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-white">
          Total de Atendimentos
        </CardTitle>
        <ClipboardList className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-10 w-10 rounded mb-3" />
        ) : (
          <div className="text-3xl font-bold font-calsans text-white">
            {total.toLocaleString('pt-BR', {
              minimumIntegerDigits: 2,
              useGrouping: false,
            })}
          </div>
        )}

        {isLoading ? (
          <Skeleton className="h-4 w-64 rounded-full" />
        ) : (
          <div className="text-sm font-medium text-muted-foreground">
            Total de atendimentos cadastrados
          </div>
        )}
      </CardContent>
    </Card>
  )
}
