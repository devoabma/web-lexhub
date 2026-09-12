import { PageHeader } from '@/components/app/page-header'
import type { Metadata } from 'next'
import { NewServiceType } from './components/new-type'
import { ServicesTypesList } from './components/types-list'

export const metadata: Metadata = {
  title: 'Tipos de Atendimentos | OAB Atende',
}

export default function ServicesTypesPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Controle de Serviços"
        description="Catálogo de tipos de serviço usados para classificar os atendimentos."
        actions={
          <>
            {/* FIXME: Componente de Novo Tipo de Servico */}
            <NewServiceType />
          </>
        }
      />

      {/* FIXME: Componente que lista os tipos de serviços */}
      <ServicesTypesList />
    </div>
  )
}
