import { ClientProvider } from '@/components/app/client-provider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="pt-BR" className={`${inter.variable} antialiased`}>
      <body>
        <ClientProvider>{children}</ClientProvider>
        <Toaster richColors closeButton theme="dark" />
      </body>
    </html>
  )
}
