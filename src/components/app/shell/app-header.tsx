'use client'

import { usePathname } from 'next/navigation'

import { BrandWave } from '@/components/app/brand/brand-wave'
import { ThemeToggle } from '@/components/app/theme-toggle'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { getRouteTitle } from './nav-config'

export function AppHeader() {
  const pathname = usePathname()
  const title = getRouteTitle(pathname)

  return (
    <header className="sticky top-0 z-30 flex h-12 shrink-0 items-center gap-2 overflow-hidden border-b bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/75 md:px-6">
      <SidebarTrigger className="-ml-1" />

      <Separator
        orientation="vertical"
        className="mr-1 data-[orientation=vertical]:h-5"
      />

      <span className="truncate font-heading font-semibold text-[13px]">
        {title}
      </span>

      <div className="relative z-10 ml-auto flex items-center gap-1 sm:mr-20">
        <ThemeToggle />
      </div>

      <BrandWave className="absolute top-0 right-0 hidden h-full w-24 sm:block" />
    </header>
  )
}
