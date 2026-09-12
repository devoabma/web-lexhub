import { Building2, MonitorSmartphone } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface AssistanceBadgeProps {
  type: 'PERSONALLY' | 'REMOTE'
}

export default function AssistanceBadge({ type }: AssistanceBadgeProps) {
  if (type === 'PERSONALLY') {
    return (
      <Badge variant="info">
        <Building2 />
        Presencial
      </Badge>
    )
  }

  return (
    <Badge variant="sky">
      <MonitorSmartphone />
      Remoto
    </Badge>
  )
}
