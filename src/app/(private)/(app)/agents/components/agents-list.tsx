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
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'

export function AgentsList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  // Query para pegar os funcionários
  const { data: results } = useQuery({
    queryKey: ['agents', pageIndex],
    queryFn: () => getAll({ pageIndex }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  function handlePageChange(pageIndex: number) {
    // Atualiza os parâmetros da URL
    const params = new URLSearchParams(searchParams.toString())

    // Atualiza o parâmetro page
    params.set('page', pageIndex.toString())

    // Redireciona para a nova URL
    router.push(`?${params.toString()}`)
  }

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
              <TableHead className="max-w-xs text-center">Cargo</TableHead>
              <TableHead className="w-52 text-center">Situação</TableHead>
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
      {results && (
        <Pagination
          onPageChange={handlePageChange}
          pageIndex={pageIndex}
          totalCount={results.total}
          perPage={2}
        />
      )}
    </>
  )
}
