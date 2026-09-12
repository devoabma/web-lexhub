import {
  Bolt,
  ClipboardList,
  LayoutDashboard,
  type LucideIcon,
  Users,
} from 'lucide-react'

export interface NavItem {
  title: string
  route: string
  icon: LucideIcon
}

export interface NavGroup {
  label: string
  adminOnly: boolean
  items: NavItem[]
}

// Fonte única da navegação: usada pela barra lateral e pelo título do cabeçalho
export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Menu',
    adminOnly: false,
    items: [
      { title: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
      { title: 'Atendimentos', route: '/services', icon: ClipboardList },
    ],
  },
  {
    label: 'Administração',
    adminOnly: true,
    items: [
      { title: 'Controle de Serviços', route: '/services-types', icon: Bolt },
      { title: 'Funcionários', route: '/agents', icon: Users },
    ],
  },
]

export function isRouteActive(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`)
}

export function getRouteTitle(pathname: string) {
  for (const group of NAV_GROUPS) {
    const item = group.items.find(item => isRouteActive(pathname, item.route))

    if (item) return item.title
  }

  return 'OAB Atende'
}
