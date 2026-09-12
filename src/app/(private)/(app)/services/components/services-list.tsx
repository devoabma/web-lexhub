'use client'

import { getAllServices } from '@/api/services/get-all'
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
import { ClipboardList } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { ServiceTableFilters } from './service-table-filters'
import { ServiceTableRow } from './service-table-row'
import { ServiceTableSkeleton } from './service-table-skeleton'

interface ServicesListProps {
  idAgentAuthenticated: string | false
  isAgentAdmin: boolean
}
export function ServicesList({
  idAgentAuthenticated,
  isAgentAdmin,
}: ServicesListProps) {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const oab = searchParams.get('oab')
  const lawyerName = searchParams.get('lawyerName')
  const agentName = searchParams.get('agentName')
  const assistance = searchParams.get('assistance')
  const status = searchParams.get('status')

  // FIXME: Query para pegar os atendimentos
  const { data: results, isLoading } = useQuery({
    queryKey: [
      'services',
      pageIndex,
      oab,
      lawyerName,
      agentName,
      assistance,
      status,
    ],
    queryFn: () =>
      getAllServices({
        pageIndex,
        oab,
        lawyerName,
        agentName,
        assistance: assistance === 'ALL' ? null : assistance,
        status: status === 'ALL' ? null : status,
      }),
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
      {/* FIXME: Componente Service Table Filters */}
      <ServiceTableFilters />

      <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Advogado(a)</TableHead>
              <TableHead className="hidden w-36 sm:table-cell">
                Status
              </TableHead>
              <TableHead className="hidden w-32 md:table-cell">
                Atendimento
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Funcionário(a)
              </TableHead>
              <TableHead className="hidden w-44 lg:table-cell">
                Atualizado
              </TableHead>
              <TableHead className="w-32 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          {/* FIXME: Componente Service Table Row */}
          <TableBody>
            {isLoading && <ServiceTableSkeleton />}

            {results?.services.length === 0 && (
              <TableEmptyState
                colSpan={6}
                icon={ClipboardList}
                title="Não encontramos nenhum atendimento cadastrado."
                description="Ajuste os filtros ou registre um novo atendimento."
              />
            )}

            {results?.services.map(service => {
              return (
                <ServiceTableRow
                  key={service.id}
                  services={service}
                  idAgentAuthenticated={idAgentAuthenticated}
                  isAgentAdmin={isAgentAdmin}
                />
              )
            })}
          </TableBody>
        </Table>

        {/* FIXME: Componente de Paginação */}
        <div className="border-t px-3 py-2">
          <Pagination
            onPageChange={handlePageChange}
            pageIndex={pageIndex}
            totalCount={results?.total ?? 0}
            finalText="atendimento(s)"
            perPage={10}
          />
        </div>
      </div>
    </div>
  )
}
