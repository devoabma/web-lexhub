import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { calculateShare } from '@/utils/calculate-share'
import { formatMetric } from './metric-card'

export interface RankingItem {
  id: string
  name: string
  detail?: string
  total: number
  isHighlighted?: boolean
}

interface RankingListProps {
  label: string
  items: RankingItem[]
  servicesInPeriod: number
}

// Itens na ordem recebida da API (total desc e, no empate, nome)
export function RankingList({
  label,
  items,
  servicesInPeriod,
}: RankingListProps) {
  return (
    <ol aria-label={label} className="divide-y">
      {items.map((item, index) => {
        const share = calculateShare(item.total, servicesInPeriod)

        return (
          <li
            key={item.id}
            className={cn(
              'flex items-center gap-3 py-2',
              item.isHighlighted && '-mx-2 rounded-md bg-primary/5 px-2'
            )}
          >
            <span
              className={cn(
                'flex size-6 shrink-0 items-center justify-center rounded-full font-medium text-[11px] tabular-nums',
                index < 3
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground'
              )}
            >
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 items-center gap-1.5">
                <p className="truncate font-medium text-[13px]">{item.name}</p>
                {item.isHighlighted && <Badge variant="info">Você</Badge>}
              </div>
              {item.detail && (
                <p className="text-muted-foreground text-xs tabular-nums">
                  {item.detail}
                </p>
              )}
            </div>

            <div className="shrink-0 text-right">
              <p className="font-medium text-[13px] tabular-nums">
                {formatMetric(item.total)}
              </p>
              <p className="text-muted-foreground text-xs tabular-nums">
                {share.toFixed(1)}%
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function RankingSkeleton({
  rows,
  withDetail = false,
}: {
  rows: number
  withDetail?: boolean
}) {
  return (
    <div className="divide-y">
      {Array.from({ length: rows }, (_, row) => `skeleton-${row}`).map(key => (
        <div key={key} className="flex items-center gap-3 py-2">
          <Skeleton className="size-6 shrink-0 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-3/5" />
            {withDetail && <Skeleton className="h-3 w-20" />}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Skeleton className="h-3.5 w-8" />
            <Skeleton className="h-3 w-10" />
          </div>
        </div>
      ))}
    </div>
  )
}
