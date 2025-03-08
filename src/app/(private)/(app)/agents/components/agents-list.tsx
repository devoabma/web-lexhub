'use client'

import { getAll } from '@/api/agents/get-all'
import { Pagination } from '@/components/app/pagination'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { AgentTableFilters } from './agent-table-filters'
import { AgentTableRow } from './agent-table-row'

export function AgentsList() {
  // FIXME: Query para pegar os funcionários
  const { data: results } = useQuery({
    queryKey: ['agents'],
    queryFn: getAll,
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <>
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
            {results?.agents.map(agent => {
              return <AgentTableRow key={agent.id} agents={agent} />
            })}
          </TableBody>
        </Table>
      </div>

      {/* FIXME: Componente de Paginação */}
      <Pagination pageIndex={0} totalCount={5} perPage={10} />
    </>
  )
}
