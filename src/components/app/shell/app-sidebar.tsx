'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { BrandLogo } from '@/components/app/brand/brand-logo'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar'
import { NAV_GROUPS, isRouteActive } from './nav-config'
import { NavUser } from './nav-user'

interface AppSidebarProps {
  hasPrivilegedAccess: boolean
}

export function AppSidebar({ hasPrivilegedAccess }: AppSidebarProps) {
  const pathname = usePathname()
  const { isMobile, setOpenMobile } = useSidebar()

  const groups = NAV_GROUPS.filter(
    group => !group.adminOnly || hasPrivilegedAccess
  )

  function handleNavigate() {
    // No celular a barra é um painel sobre o conteúdo: fecha ao navegar
    if (isMobile) setOpenMobile(false)
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-12 justify-center py-0 group-data-[collapsible=icon]:px-1">
        <Link
          href="/dashboard"
          onClick={handleNavigate}
          aria-label="OAB Maranhão — ir para o Dashboard"
          className="flex items-center justify-center rounded-md outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring group-data-[collapsible=icon]:p-0"
        >
          <BrandLogo
            priority
            className="w-30 group-data-[collapsible=icon]:hidden"
          />
          <BrandLogo
            variant="symbol"
            className="hidden w-8 group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="mx-0" />

      <SidebarContent>
        {groups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => {
                  const isActive = isRouteActive(pathname, item.route)

                  return (
                    <SidebarMenuItem key={item.route}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className="relative before:absolute before:inset-y-1.5 before:left-0 before:w-1 before:rounded-full before:bg-brand-red before:opacity-0 before:transition-opacity data-[active=true]:font-semibold data-[active=true]:text-sidebar-primary data-[active=true]:before:opacity-100"
                      >
                        <Link
                          href={item.route}
                          onClick={handleNavigate}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
