'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts'

const servicesInMonth = [
  { data: 'Jan', services: 4 },
  { data: 'Fev', services: 6 },
  { data: 'Mar', services: 1 },
  { data: 'Abr', services: 3 },
  { data: 'Mai', services: 5 },
  { data: 'Jun', services: 2 },
  { data: 'Jul', services: 7 },
  { data: 'Ago', services: 8 },
  { data: 'Set', services: 4 },
  { data: 'Out', services: 6 },
  { data: 'Nov', services: 3 },
  { data: 'Dez', services: 9 },
]

export function ServiceChart() {
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
