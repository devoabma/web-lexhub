'use client'

import { getAllServices } from '@/api/services/get-all'
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
import { ServiceTableFilters } from './service-table-filters'
import { ServiceTableRow } from './service-table-row'

export function ServicesList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const oab = searchParams.get('oab')
  const lawyerName = searchParams.get('lawyerName')
  const agentName = searchParams.get('agentName')
  const assistance = searchParams.get('assistance')
  const status = searchParams.get('status')

  // FIXME: Query para pegar os atendimentos
  const { data: results } = useQuery({
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
    <>
      {/* FIXME: Componente Service Table Filters */}
      <ServiceTableFilters />

      <div className="border rounded mt-8">
        <Table>
          {results?.services.length === 0 && (
            <TableCaption className="pb-4 text-muted-foreground">
              Não encontramos nenhum atendimento cadastrado.
            </TableCaption>
          )}

          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead className="w-28">Status</TableHead>
              <TableHead className="w-38 text-center">
                {results?.services.some(service => service.status === 'OPEN')
                  ? 'Realizado há'
                  : 'Finalizado há'}
              </TableHead>
              <TableHead className="w-32 text-center">Atendimento</TableHead>
              <TableHead className="w-28 text-center">Número OAB</TableHead>
              <TableHead className="max-w-xs">Advogado(a)</TableHead>
              <TableHead className="w-78">Funcionário(a)</TableHead>
              <TableHead className="w-28" />
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>

          {/* FIXME: Componente Service Table Row */}
          <TableBody className="border-b">
            {results?.services.map(service => {
              return <ServiceTableRow key={service.id} services={service} />
            })}
          </TableBody>
        </Table>
      </div>

      {/* FIXME: Componente de Paginação */}
      <Pagination
        onPageChange={handlePageChange}
        pageIndex={pageIndex}
        totalCount={results?.total ?? 0}
        finalText="atendimento(s)"
        perPage={10}
      />
    </>
  )
}
