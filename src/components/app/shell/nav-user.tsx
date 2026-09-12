'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronsUpDown, LogOut } from 'lucide-react'
import { useState } from 'react'

import { getProfile } from '@/api/agents/get-profile'
import { RoleBadge } from '@/components/app/role-badge'
import { ThemeRadioItems } from '@/components/app/theme-toggle'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import { LogoutDialog } from './logout-dialog'

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Number.POSITIVE_INFINITY,
  })

  // Sem perfil (ex.: sessão recusada pela API), o usuário ainda precisa conseguir sair
  if (isError) {
    return (
      <>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sair"
              onClick={() => setIsLogoutOpen(true)}
            >
              <LogOut />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <LogoutDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
      </>
    )
  }

  if (isLoading || !profile) {
    return (
      <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:p-0">
        <Skeleton className="size-8 shrink-0 rounded-lg" />
        <div className="grid flex-1 gap-1.5 group-data-[collapsible=icon]:hidden">
          <Skeleton className="h-3.5 w-28" />
          <Skeleton className="h-3 w-36" />
        </div>
      </div>
    )
  }

  const { agent } = profile
  const initials = getInitials(agent.name)

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          {/* modal={false}: evita conflito de foco ao abrir o diálogo de logout a partir do menu */}
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary font-semibold text-primary-foreground text-xs">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{agent.name}</span>
                  <span className="truncate text-muted-foreground text-xs">
                    {agent.email}
                  </span>
                </div>

                <ChevronsUpDown className="ml-auto size-4" />
                <span className="sr-only">Abrir menu do usuário</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={isMobile ? 'bottom' : 'right'}
              align="end"
              sideOffset={4}
              className="w-(--radix-dropdown-menu-trigger-width) min-w-60 rounded-lg"
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="size-8 rounded-lg">
                    <AvatarFallback className="rounded-lg bg-primary font-semibold text-primary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="grid flex-1 leading-tight">
                    <span className="truncate font-medium">{agent.name}</span>
                    <span className="truncate text-muted-foreground text-xs">
                      {agent.email}
                    </span>
                  </div>
                </div>

                <div className="px-1 pb-1.5">
                  <span className="sr-only">Cargo:</span>
                  <RoleBadge role={agent.role} />
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuLabel className="text-muted-foreground text-xs">
                Tema
              </DropdownMenuLabel>
              <ThemeRadioItems />

              <DropdownMenuSeparator />

              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setIsLogoutOpen(true)}
              >
                <LogOut />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <LogoutDialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen} />
    </>
  )
}
