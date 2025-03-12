'use client'

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
import { Edit } from 'lucide-react'

export function ServicesTypesList() {
  return (
    <>
      {/* FIXME: Componente Types Services Table Filters */}
      {/* Adicionar aqui */}

      <div className="border rounded mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-28">Identificador</TableHead>
              <TableHead className="w-96">Nome do Serviço</TableHead>
              <TableHead className="w-28 text-center" />
            </TableRow>
          </TableHeader>

          <TableBody>
            <TableRow className="overflow-x-auto">
              <TableCell className="relative font-mono text-xs font-medium border-r">
                cm79suudv0001i3m0ekk2ed44
                <CopyContentField value="cm79suudv0001i3m0ekk2ed44" />
              </TableCell>

              <TableCell className="relative font-medium truncate max-w-xs border-r">
                Instalação e configuração total para usar o GERID Inss Digital
                <CopyContentField value="Instalação e configuração total para usar o GERID Inss Digital" />
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
          </TableBody>
        </Table>
      </div>

      {/* FIXME: Componente de Paginação */}
      <Pagination
        onPageChange={() => {}}
        pageIndex={1}
        totalCount={10}
        perPage={10}
      />
    </>
  )
}
