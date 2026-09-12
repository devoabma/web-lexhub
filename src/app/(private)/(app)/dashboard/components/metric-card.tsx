import { type LucideIcon, TrendingDown, TrendingUp } from 'lucide-react'
import type * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Formato usado em todos os números do dashboard: dois dígitos, sem separador
export function formatMetric(value: number) {
  return value.toLocaleString('pt-BR', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })
}

interface MetricCardProps {
  title: string
  icon: LucideIcon
  children: React.ReactNode
}

export function MetricCard({ title, icon: Icon, children }: MetricCardProps) {
  return (
    <Card className="gap-3 border-t-2 border-t-primary transition-colors hover:border-t-brand-red">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="font-medium font-sans text-[13px] text-muted-foreground">
          {title}
        </CardTitle>
        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="size-4" aria-hidden />
        </span>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  )
}

export function MetricValue({
  value,
  isLoading,
}: {
  value: number
  isLoading?: boolean
}) {
  if (isLoading) return <Skeleton className="h-8 w-16" />

  return (
    <p className="font-heading font-semibold text-2xl tabular-nums tracking-tight">
      {formatMetric(value)}
    </p>
  )
}

export function TrendBadge({ value }: { value: number }) {
  const isUp = value >= 0

  return (
    <Badge variant={isUp ? 'success' : 'danger'} className="tabular-nums">
      {isUp ? <TrendingUp /> : <TrendingDown />}
      {isUp ? '+' : ''}
      {value.toFixed(1)}%
    </Badge>
  )
}
