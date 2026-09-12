import { CircleCheck } from 'lucide-react'

import { Badge, BadgeDot } from '@/components/ui/badge'

interface ServiceStatusBadgeProps {
  status: 'OPEN' | 'COMPLETED'
}

export function ServiceStatusBadge({ status }: ServiceStatusBadgeProps) {
  if (status === 'OPEN') {
    return (
      <Badge variant="warning">
        <BadgeDot pulse />
        Em andamento
      </Badge>
    )
  }

  return (
    <Badge variant="success">
      <CircleCheck />
      Concluído
    </Badge>
  )
}
