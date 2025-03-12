'use client'

import { getAll } from '@/api/services-types/get-all'
import { CopyContentField } from '@/components/app/copy-content-field'
import { Pagination } from '@/components/app/pagination'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useQuery } from '@tanstack/react-query'
import { Edit } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { z } from 'zod'
import { TypesTableFilters } from './types-table-filters'

export function ServicesTypesList() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const pageIndex = z.coerce.number().parse(searchParams.get('page') ?? '1')

  const id = searchParams.get('id')
  const name = searchParams.get('name')

  const { data: results } = useQuery({
    queryKey: ['types', pageIndex, id, name],
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
          <TableHeader>
            <TableRow className="overflow-x-auto">
              <TableHead className="w-28">Identificador</TableHead>
              <TableHead className="w-96">Nome do Serviço</TableHead>
              <TableHead className="w-28 text-center" />
            </TableRow>
          </TableHeader>

          <TableBody>
            {results?.servicesTypes.map(serviceType => {
              return (
                <TableRow key={serviceType.id} className="overflow-x-auto">
                  <TableCell className="relative font-mono text-xs font-medium border-r">
                    {serviceType.id}
                    <CopyContentField value={serviceType.id} />
                  </TableCell>

                  <TableCell className="relative font-medium truncate max-w-xs border-r">
                    {serviceType.name}
                    <CopyContentField value={serviceType.name} />
                  </TableCell>

                  <TableCell className="flex items-center justify-center">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded flex items-center w-full hover:border-emerald-500 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                          <Edit className="size-3.5 text-emerald-500" />
                          Alterar
                        </Button>
                      </DialogTrigger>

                      {/* TODO: Componente de Alterar Tipo */}
                    </Dialog>
                  </TableCell>
                </TableRow>
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
      />
    </>
  )
}
