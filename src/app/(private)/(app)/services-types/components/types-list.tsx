'use client'

import { getAll } from '@/api/services-types/get-all'
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
import { Layers } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { TypesTableFilters } from './types-table-filters'
import { ServicesTypesTableRow } from './types-table-row'
import { TypesTableSkeleton } from './types-table-skeleton'

export function ServicesTypesList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const id = searchParams.get('id')
  const name = searchParams.get('name')

  const { data: results, isLoading } = useQuery({
    queryKey: ['services-types', pageIndex, id, name],
    queryFn: () => getAll({ pageIndex, id, name }),
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
      {/* FIXME: Componente Types Services Table Filters */}
      <TypesTableFilters />

      <div className="overflow-hidden rounded-lg border bg-card shadow-xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Serviço</TableHead>
              <TableHead className="hidden w-80 md:table-cell">
                Identificador
              </TableHead>
              <TableHead className="w-24 text-right">
                <span className="sr-only">Ações</span>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TypesTableSkeleton />}

            {results?.servicesTypes.length === 0 && (
              <TableEmptyState
                colSpan={3}
                icon={Layers}
                title="Não encontramos nenhum tipo de serviço cadastrado."
                description="Ajuste os filtros ou cadastre um novo serviço."
              />
            )}

            {results?.servicesTypes.map(serviceType => {
              return (
                <ServicesTypesTableRow
                  key={serviceType.id}
                  serviceTypes={serviceType}
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
            perPage={10}
            finalText="serviço(s)"
          />
        </div>
      </div>
    </div>
  )
}
