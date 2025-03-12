import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'
import { ServicesTypesList } from './components/types-list'

export const metadata: Metadata = {
  title: 'Tipos de Atendimentos | OAB Atende',
}

export default function ServicesTypesPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-calsans font-bold tracking-tight">
        Controle de Serviços
      </h1>

      <Separator orientation="horizontal" />

      <div className="space-y-2.5 mt-4">
        {/* FIXME: Componente que lista os tipos de serviços */}
        <ServicesTypesList />
      </div>
    </div>
  )
}
