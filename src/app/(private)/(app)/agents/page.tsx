import { PageHeader } from '@/components/app/page-header'
import type { Metadata } from 'next'
import { AgentsList } from './components/agents-list'
import { NewAgent } from './components/new-agent'

export const metadata: Metadata = {
  title: 'Funcionários | OAB Atende',
}

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-5">
      <PageHeader
        title="Gestão de Funcionários"
        description="Cadastre funcionários e controle quem tem acesso ao sistema."
        actions={
          <>
            {/* FIXME: Componente de Novo Funcionario */}
            <NewAgent />
          </>
        }
      />

      {/* FIXME: Componente que lista os funcionários */}
      <AgentsList />
    </div>
  )
}
