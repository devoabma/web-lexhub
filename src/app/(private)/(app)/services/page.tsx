import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Metadata } from 'next'
import { NewService } from './components/new-service'
import { ServiceTableFilters } from './components/service-table-filters'
import { ServiceTableRow } from './components/service-table-row'

export const metadata: Metadata = {
  title: 'Atendimentos | OAB Atende',
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-calsans font-bold tracking-tight">
          Central de Atendimentos
        </h1>

        {/* FIXME: Componente de Novo Atendimento */}
        <NewService />
      </div>

      <Separator orientation="horizontal" />

      <div className="space-y-2.5 mt-4">
        {/* FIXME: Componente Service Table Filters */}
        <ServiceTableFilters />

        <div className="border rounded mt-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12" />
                <TableHead className="w-36">Status</TableHead>
                <TableHead className="w-28">Realizado há</TableHead>
                <TableHead className="w-28">Atendimento</TableHead>
                <TableHead className="w-28">Número OAB</TableHead>
                <TableHead className="max-w-xs">Advogado(a)</TableHead>
                <TableHead className="max-w-xs">Funcionário(a)</TableHead>
                <TableHead className="w-28" />
                <TableHead className="w-28" />
              </TableRow>
            </TableHeader>

            {/* FIXME: Componente Service Table Row */}
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <ServiceTableRow key={i} />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* FIXME: Componente de Paginação */}
        {/* <Pagination pageIndex={0} totalCount={105} perPage={10} /> */}
      </div>
    </div>
  )
}
