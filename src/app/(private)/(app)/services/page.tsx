import { Separator } from '@/components/ui/separator'
import type { Metadata } from 'next'
import { NewService } from './components/new-service'
import { NewServiceExternal } from './components/new-service-external'
import { ServicesList } from './components/services-list'

export const metadata: Metadata = {
  title: 'Atendimentos | OAB Atende',
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-calsans font-bold tracking-tight">
          Central de Atendimentos
        </h1>

        <div className="flex items-center gap-2">
          <NewServiceExternal />

          {/* FIXME: Componente de Novo Atendimento */}
          <NewService />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="space-y-2.5 mt-4">
        {/* FIXME: Componente que lista os atendimentos */}
        <ServicesList />
      </div>
    </div>
  )
}
