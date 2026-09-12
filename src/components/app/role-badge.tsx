import { ShieldCheck, UserRound } from 'lucide-react'

import { Badge } from '@/components/ui/badge'

interface RoleBadgeProps {
  role: 'ADMIN' | 'MEMBER'
  className?: string
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  if (role === 'ADMIN') {
    return (
      <Badge variant="info" className={className}>
        <ShieldCheck />
        Administrador
      </Badge>
    )
  }

  return (
    <Badge variant="neutral" className={className}>
      <UserRound />
      Membro
    </Badge>
  )
}
