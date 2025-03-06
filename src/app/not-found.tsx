import { NotFound404 } from '@/components/app/404'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 | OAB Atende',
}

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <NotFound404 />
    </div>
  )
}
