'use client'

import Image from 'next/image'

import LogoOAB from '@/assets/logo-oabma.png'
import { Separator } from '@/components/ui/separator'
import { Bolt, ClipboardList, Monitor, Users } from 'lucide-react'
import { NavItem } from './nav-item'
import { Profile } from './profile'

interface SidebarMenuProps {
  hasPrivilegedAccess: boolean
}

export function SidebarMenu({ hasPrivilegedAccess }: SidebarMenuProps) {
  return (
    <aside className="bg-muted-foreground/5 flex items-center flex-col gap-6 border-r px-5 py-8">
      <Image src={LogoOAB} alt="OAB Atende" width={170} height={28} priority />

      <Separator orientation="horizontal" />

      <nav className="space-y-0.5 w-full">
        <NavItem title="Dashboard" icon={Monitor} route="/dashboard" />
        <NavItem title="Atendimentos" icon={ClipboardList} route="/services" />

        {hasPrivilegedAccess && (
          <>
            <NavItem
              title="Controle de Serviços"
              icon={Bolt}
              route="/services-types"
            />
            <NavItem title="Funcionários" icon={Users} route="/agents" />
          </>
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-6 w-full">
        <Separator orientation="horizontal" />
        <Profile />
      </div>
    </aside>
  )
}
