'use client'

import { CopyContentField } from '@/components/app/copy-content-field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { UpdateServiceTypeDialog } from './update-type-dialog'

interface ServiceTypeTableRowProps {
  serviceTypes: {
    id: string
    name: string
  }
}

export function ServicesTypesTableRow({
  serviceTypes,
}: ServiceTypeTableRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <TableRow key={serviceTypes.id} className="">
      <TableCell className="relative font-mono text-xs font-medium border-r">
        {serviceTypes.id}
        <CopyContentField value={serviceTypes.id} />
      </TableCell>

      <TableCell className="relative font-medium truncate border-r">
        {serviceTypes.name}
        <CopyContentField value={serviceTypes.name} />
      </TableCell>

      <TableCell className="flex items-center justify-center">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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

          {/* FIXME: Componente de Alterar Tipo */}
          <UpdateServiceTypeDialog
            serviceTypes={serviceTypes}
            onOpenChange={setIsDialogOpen}
          />
        </Dialog>
      </TableCell>
    </TableRow>
  )
}
