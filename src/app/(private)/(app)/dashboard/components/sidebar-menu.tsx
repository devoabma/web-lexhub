'use client'

import Image from 'next/image'

import LogoOAB from '@/assets/logo-oabma.png'
import { Separator } from '@/components/ui/separator'
import { HelpingHand, Monitor, SquarePlus } from 'lucide-react'
import { NavItem } from './nav-item'
import { Profile } from './profile'

export function SidebarMenu() {
  return (
    <aside className="bg-muted-foreground/5 flex items-center flex-col gap-6 border-r px-5 py-8">
      <Image src={LogoOAB} alt="OAB Atende" width={170} height={28} />

      <Separator orientation="horizontal" />

      <nav className="space-y-0.5 w-full">
        <NavItem title="Dashboard" icon={Monitor} route="/dashboard" />
        <NavItem title="Atendimentos" icon={HelpingHand} route="/services" />
        <NavItem
          title="Tipos de Atendimentos"
          icon={SquarePlus}
          route="/services-types"
        />
      </nav>

      <div className="mt-auto flex flex-col gap-6">
        <Separator orientation="horizontal" />
        <Profile />
      </div>
    </aside>
  )
}
