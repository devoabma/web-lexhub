'use client'

import { getAll } from '@/api/agents/get-all'
import { Pagination } from '@/components/app/pagination'
import { TableEmptyState } from '@/components/app/table-empty-state'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { Users } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { AgentTableFilters } from './agent-table-filters'
import { AgentTableRow } from './agent-table-row'
import { AgentsTableSkeleton } from './agents-table-skeleton'

export function AgentsList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const name = searchParams.get('name')
  const role = searchParams.get('role')

  // Query para pegar os funcionários
  const { data: results, isLoading } = useQuery({
    queryKey: ['agents', pageIndex, name, role],
    queryFn: () =>
      getAll({ pageIndex, name, role: role === 'ALL' ? null : role }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  function handlePageChange(pageIndex: number) {
    // Cria uma instância de URLSearchParams baseada nos parâmetros de busca atuais
    const params = new URLSearchParams(searchParams.toString())

    // Atualiza o parâmetro "page" com o novo índice da página
    params.set('page', pageIndex.toString())

    // Atualiza a URL no navegador sem recarregar a página
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* FIXME: Componente Agent Table Filters */}
      <AgentTableFilters />

      <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Funcionário(a)</TableHead>
              <TableHead className="hidden w-40 md:table-cell">Cargo</TableHead>
              <TableHead className="hidden w-56 sm:table-cell">
                Situação
              </TableHead>
              <TableHead className="w-14 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* FIXME: Componente Agent Table Row */}
          <TableBody>
            {isLoading && <AgentsTableSkeleton />}

            {results?.agents.length === 0 && (
              <TableEmptyState
                colSpan={4}
                icon={Users}
                title="Não encontramos nenhum funcionário cadastrado."
                description="Ajuste os filtros ou cadastre um novo funcionário."
              />
            )}

            {results?.agents.map(agent => {
              return <AgentTableRow key={agent.id} agents={agent} />
            })}
          </TableBody>
        </Table>

        {/* FIXME: Componente de Paginação */}
        <div className="border-t px-3 py-2">
          <Pagination
            onPageChange={handlePageChange}
            pageIndex={pageIndex}
            totalCount={results?.total ?? 0}
            perPage={10}
            finalText="funcionário(s)"
          />
        </div>
      </div>
    </div>
  )
}
