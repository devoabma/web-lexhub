import { checkAdminStatus } from '@/auth'
import { AppHeader } from '@/components/app/shell/app-header'
import { AppSidebar } from '@/components/app/shell/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
  title: 'Home | OAB Atende',
}

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const hasPrivilegedAccess = await checkAdminStatus()

  // Estado da barra lateral salvo pelo próprio componente (cookie sidebar_state),
  // lido no servidor para renderizar já expandida/recolhida
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value !== 'false'

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar hasPrivilegedAccess={hasPrivilegedAccess} />

      {/* min-w-0: sem isso o item flex cresce até a largura das tabelas e a página rola na horizontal */}
      <SidebarInset className="min-w-0">
        <AppHeader />

        <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-5 md:px-6">
          <div className="animate-slide-up">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
