import { Pagination } from '@/components/app/pagination'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Metadata } from 'next'
import { AgentTableFilters } from './components/agent-table-filters'
import { AgentTableRow } from './components/agent-table-row'
import { NewAgent } from './components/new-agent'

export const metadata: Metadata = {
  title: 'Funcionários | OAB Atende',
}

export default function AgentsPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-calsans font-bold tracking-tight">
          Gestão de Funcionários
        </h1>

        {/* FIXME: Componente de Novo Funcionario */}
        <NewAgent />
      </div>

      <Separator orientation="horizontal" />

      <div className="space-y-2.5 mt-4">
        {/* FIXME: Componente Agent Table Filters */}
        <AgentTableFilters />

        <div className="border rounded mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome do Funcionário</TableHead>
                <TableHead>E-mail cadastrado</TableHead>
                <TableHead className="max-w-xs">Cargo</TableHead>
                <TableHead className="max-w-xs">Inativo?</TableHead>
                <TableHead className="w-28" />
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>

            {/* FIXME: Componente Agent Table Row */}
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <AgentTableRow key={i} />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* FIXME: Componente de Paginação */}
        <Pagination pageIndex={0} totalCount={5} perPage={10} />
      </div>
    </div>
  )
}
