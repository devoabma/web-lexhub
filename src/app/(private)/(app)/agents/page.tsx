import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Funcionários | OAB Atende',
}

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-calsans font-bold tracking-tight">
        Controle de Funcionários
      </h1>

      <Separator orientation="horizontal" />
    </div>
  )
}
