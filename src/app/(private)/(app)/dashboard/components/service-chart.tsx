'use client'

import { getAllServices } from '@/api/services/get-all'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuery } from '@tanstack/react-query'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

// const servicesInMonth = [
//   { data: 'Jan', services: 4 },
//   { data: 'Fev', services: 6 },
//   { data: 'Mar', services: 1 },
//   { data: 'Abr', services: 3 },
//   { data: 'Mai', services: 5 },
//   { data: 'Jun', services: 2 },
//   { data: 'Jul', services: 7 },
//   { data: 'Ago', services: 8 },
//   { data: 'Set', services: 4 },
//   { data: 'Out', services: 6 },
//   { data: 'Nov', services: 3 },
//   { data: 'Dez', services: 9 },
// ]

export function ServiceChart() {
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => getAllServices({}),
  })

  // Função para processar os dados da API
  function processServicesByMonth() {
    const monthCounts = Array(12).fill(0)
    const monthAbbreviations = [
      'Jan',
      'Fev',
      'Mar',
      'Abr',
      'Mai',
      'Jun',
      'Jul',
      'Ago',
      'Set',
      'Out',
      'Nov',
      'Dez',
    ]

    servicesData?.services.map(service => {
      const date = new Date(service.createdAt)
      const month = date.getMonth() // Retorna 0-11
      monthCounts[month]++
    })

    return monthAbbreviations.map((abbrev, index) => ({
      data: abbrev,
      services: monthCounts[index],
    }))
  }

  const servicesInMonth = processServicesByMonth()

  return (
    <Card className="col-span-9 rounded-2xl">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1">
          <CardTitle className="text-base font-medium">
            Atendimentos por mês
          </CardTitle>
          <CardDescription>Atendimento mensal por período</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={servicesInMonth} style={{ fontSize: 12 }}>
            <YAxis
              stroke="#888"
              tickLine={false}
              axisLine={false}
              width={80}
              tickFormatter={value => `${value} Atend.`}
            />

            <XAxis
              dataKey={'servicesInMonth'}
              tickLine={false}
              axisLine={false}
              dy={16}
            />

            <CartesianGrid vertical={false} className="stroke-muted" />

            <Line
              type="linear"
              dataKey="services"
              stroke="#0284c7"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
