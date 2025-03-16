'use client'

import { getAllServices } from '@/api/services/get-all'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { ServiceTableFilters } from './service-table-filters'
import { ServiceTableRow } from './service-table-row'

export function ServicesList() {
  const { data: results } = useQuery({
    queryKey: ['services'],
    queryFn: () => getAllServices({ pageIndex: 1 }),
    staleTime: Number.POSITIVE_INFINITY,
  })

  return (
    <>
      {/* FIXME: Componente Service Table Filters */}
      <ServiceTableFilters />

      <div className="border rounded mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12" />
              <TableHead className="w-28 text-center">Status</TableHead>
              <TableHead className="w-38 text-center">Realizado há</TableHead>
              <TableHead className="w-32 text-center">Atendimento</TableHead>
              <TableHead className="w-28 text-center">Número OAB</TableHead>
              <TableHead className="max-w-xs">Advogado(a)</TableHead>
              <TableHead className="w-78">Funcionário(a)</TableHead>
              <TableHead className="w-28" />
              <TableHead className="w-28" />
            </TableRow>
          </TableHeader>

          {/* FIXME: Componente Service Table Row */}
          <TableBody>
            {results?.services.map(service => {
              return <ServiceTableRow key={service.id} services={service} />
            })}
          </TableBody>
        </Table>
      </div>

      {/* FIXME: Componente de Paginação */}
      {/* <Pagination pageIndex={0} totalCount={105} perPage={10} /> */}
    </>
  )
}
