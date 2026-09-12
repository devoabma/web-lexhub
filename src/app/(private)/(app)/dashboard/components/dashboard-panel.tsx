import { CircleAlert, type LucideIcon, RotateCw } from 'lucide-react'
import type * as React from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardPanelProps {
  title: string
  description?: React.ReactNode
  isLoading: boolean
  isError: boolean
  onRetry?: () => void
  skeleton: React.ReactNode
  className?: string
  children: React.ReactNode
}

// Card dos gráficos e rankings do período: cada um cuida do próprio
// carregamento e erro, sem afetar os demais
export function DashboardPanel({
  title,
  description,
  isLoading,
  isError,
  onRetry,
  skeleton,
  className,
  children,
}: DashboardPanelProps) {
  function renderContent() {
    if (isLoading) return skeleton

    if (isError) {
      return (
        <PanelMessage
          icon={CircleAlert}
          title="Não foi possível carregar os dados."
          action={
            onRetry && (
              <Button variant="outline" size="sm" onClick={() => onRetry()}>
                <RotateCw />
                Tentar novamente
              </Button>
            )
          }
        />
      )
    }

    return children
  }

  return (
    <Card className={cn('min-w-0', className)}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <CardContent className="flex-1">{renderContent()}</CardContent>
    </Card>
  )
}

interface PanelMessageProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
}

// Estado vazio ou de erro dentro de um painel (mesmo visual do TableEmptyState)
export function PanelMessage({
  icon: Icon,
  title,
  description,
  action,
}: PanelMessageProps) {
  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-2 text-center">
      <div className="flex size-10 items-center justify-center rounded-full border bg-muted">
        <Icon className="size-4.5 text-muted-foreground" aria-hidden />
      </div>
      <p className="font-medium text-[13px]">{title}</p>
      {description && (
        <p className="max-w-sm text-muted-foreground text-xs">{description}</p>
      )}
      {action}
    </div>
  )
}
