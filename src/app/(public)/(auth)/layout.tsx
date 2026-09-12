import type { Metadata } from 'next'
import Link from 'next/link'

import { BrandLogo } from '@/components/app/brand/brand-logo'
import { BrandWave } from '@/components/app/brand/brand-wave'
import { OabOutline } from '@/components/app/brand/oab-outline'
import { ThemeToggle } from '@/components/app/theme-toggle'

export const metadata: Metadata = {
  title: 'Login | OAB Atende',
  description: '📚 Sistema de Gestão de Atendimentos da OAB Maranhão',
}

function Copyright() {
  return (
    <>
      &copy; {new Date().getFullYear()} OAB Maranhão · Gerência de Tecnologia da
      Informação. Todos os direitos reservados.
    </>
  )
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Painel institucional — composição da capa do Manual de Identidade Visual */}
      <aside className="relative hidden overflow-hidden border-r bg-card lg:flex lg:flex-col lg:justify-between lg:p-12">
        <BrandWave className="absolute top-0 right-0 w-1/2 max-w-md" />
        <OabOutline className="absolute -bottom-24 -left-16 w-[125%] max-w-none text-brand-sky/40 dark:text-brand-sky/15" />

        <Link
          href="/"
          aria-label="OAB Maranhão — página inicial"
          className="relative z-10 w-44 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <BrandLogo priority />
        </Link>

        <div className="relative z-10 max-w-md space-y-3">
          <p className="font-heading font-bold text-4xl text-primary tracking-tight">
            OAB Atende
          </p>
          <p className="text-lg text-muted-foreground">
            Registro e acompanhamento dos atendimentos à advocacia maranhense.
          </p>
        </div>

        <footer className="relative z-10 text-muted-foreground text-sm">
          <Copyright />
        </footer>
      </aside>

      <div className="flex min-h-dvh flex-col">
        <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            aria-label="OAB Maranhão — página inicial"
            className="w-32 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring lg:invisible"
          >
            <BrandLogo priority />
          </Link>

          <ThemeToggle />
        </div>

        <main className="flex flex-1 items-center justify-center px-4 pb-10 sm:px-6">
          <div className="w-full max-w-md animate-slide-up">{children}</div>
        </main>

        <footer className="px-4 pb-6 text-center text-muted-foreground text-xs lg:hidden">
          <Copyright />
        </footer>
      </div>
    </div>
  )
}
