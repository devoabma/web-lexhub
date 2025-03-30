'use client'

import { getAll } from '@/api/services-types/get-all'
import { Pagination } from '@/components/app/pagination'
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
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
    <>
      {/* FIXME: Componente Types Services Table Filters */}
      <TypesTableFilters />

      <div className="border rounded mt-8">
        <Table>
          {results?.servicesTypes.length === 0 && (
            <TableCaption className="pb-4 text-muted-foreground">
              Não encontramos nenhum tipo de serviço cadastrado.
            </TableCaption>
          )}

          <TableHeader>
            <TableRow>
              <TableHead className="w-18">Identificador</TableHead>
              <TableHead className="w-18">Nome do Serviço</TableHead>
              <TableHead className="w-18 text-center" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && <TypesTableSkeleton />}

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
      </div>

      {/* FIXME: Componente de Paginação */}
      <Pagination
        onPageChange={handlePageChange}
        pageIndex={pageIndex}
        totalCount={results?.total ?? 0}
        perPage={10}
        finalText="serviço(s)"
      />
    </>
  )
}
