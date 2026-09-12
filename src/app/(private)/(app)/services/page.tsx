import { checkAdminStatus, getIsAgentAuthenticated } from '@/auth'
import { PageHeader } from '@/components/app/page-header'
import type { Metadata } from 'next'
import { NewService } from './components/new-service'
import { NewServiceExternal } from './components/new-service-external'
import { ServicesList } from './components/services-list'

export const metadata: Metadata = {
  title: 'Atendimentos | OAB Atende',
}

export default async function ServicesPage() {
  const idAgentAuthenticated = await getIsAgentAuthenticated()
  const isAgentAdmin = await checkAdminStatus()

  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Central de Atendimentos"
        description="Registre, acompanhe e conclua os atendimentos à advocacia."
        actions={
          <>
            <NewServiceExternal />

            {/* FIXME: Componente de Novo Atendimento */}
            <NewService />
          </>
        }
      />

      {/* FIXME: Componente que lista os atendimentos */}
      <ServicesList
        idAgentAuthenticated={idAgentAuthenticated}
        isAgentAdmin={isAgentAdmin}
      />
    </div>
  )
}
