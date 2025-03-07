import type { Metadata } from 'next'
import Image from 'next/image'

import LogoOAB from '@/assets/logo-oabma.png'
import { Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Login | OAB Atende',
  description: '📚 Sistema de Gestão de Atendimentos da OAB Maranhão',
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="order-2 flex h-full flex-col justify-between border-t border-foreground/5 bg-muted p-10 text-muted-foreground md:order-1 md:border-r">
        <div className="flex flex-col items-center space-y-4 text-lg text-foreground md:flex-row md:justify-between md:space-y-0">
          <Image
            src={LogoOAB}
            alt="Logo da OAB Maranhão"
            width={180}
            height={180}
            priority
          />

          <h1 className="flex font-calsans gap-2 justify-center text-base font-semibold md:text-lg lg:text-3xl">
            <Scale className="size-7" /> OAB Atende
          </h1>
        </div>

        <footer className="text-sm">
          &copy; {new Date().getFullYear()} - Gerência de Tecnologia da
          Informação
        </footer>
      </div>

      <div className="relative order-1 flex flex-col items-center justify-center md:order-2">
        <div className="animate-slide-up">{children}</div>
      </div>
    </div>
  )
}
