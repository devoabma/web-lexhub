import { ClientProvider } from '@/components/app/client-provider'
import { Toaster } from '@/components/ui/sonner'
import type { Metadata } from 'next'
import { Barlow, Montserrat } from 'next/font/google'
import './globals.css'

// Tipografia do Manual de Identidade Visual da OAB: Barlow no texto e
// Montserrat (substituta livre da Gotham HTF) nos títulos
const barlow = Barlow({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  weight: ['500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  description: '📚 Sistema de Gestão de Atendimentos da OAB Maranhão',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${barlow.variable} ${montserrat.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ClientProvider>
          {children}
          <Toaster richColors closeButton />
        </ClientProvider>
      </body>
    </html>
  )
}
