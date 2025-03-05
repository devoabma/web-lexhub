import type { ReactNode } from 'react'

interface MessageFieldErrorProps {
  children: ReactNode
}

export function MessageFieldError({ children }: MessageFieldErrorProps) {
  return (
    <span className="mt-1 text-sm font-medium leading-none text-red-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {children}
    </span>
  )
}
