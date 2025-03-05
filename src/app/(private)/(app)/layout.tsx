import type { Metadata } from 'next'
import { SidebarMenu } from './dashboard/components/sidebar-menu'

export const metadata: Metadata = {
  title: 'Home | OAB Atende',
}

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-screen grid-cols-[280px_1fr] text-sm">
      <SidebarMenu />

      <main className="px-8 pb-12 pt-8">{children}</main>
    </div>
  )
}
