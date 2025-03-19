'use client'

import { getServicesMonthForChart } from '@/api/dashboard/get-services-month-for-chart'
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

export function ServiceChart() {
  const { data: servicesInMonth } = useQuery({
    queryKey: ['metrics', 'services-month-for-chart'],
    queryFn: getServicesMonthForChart,
  })

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

            <XAxis dataKey="data" tickLine={false} axisLine={false} dy={16} />

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
