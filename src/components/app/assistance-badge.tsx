import { Badge } from '@/components/ui/badge'

interface AssistanceBadgeProps {
  type: 'PERSONALLY' | 'REMOTE'
}

export default function AssistanceBadge({ type }: AssistanceBadgeProps) {
  return (
    <Badge
      className={`text-xs font-bold rounded-full text-center 
    ${
      type === 'PERSONALLY'
        ? 'bg-cyan-900 border border-cyan-900 text-slate-200'
        : 'bg-amber-700 border border-amber-700 text-slate-200'
    }`}
    >
      {type === 'PERSONALLY' ? 'PRESENCIAL' : 'REMOTO'}
    </Badge>
  )
}
