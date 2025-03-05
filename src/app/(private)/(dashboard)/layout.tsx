import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | OAB Atende',
}

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <div>{children}</div>
}
