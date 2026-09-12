'use client'

import { CopyContentField } from '@/components/app/copy-content-field'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { TableCell, TableRow } from '@/components/ui/table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import { UpdateServiceTypeDialog } from './update-type-dialog'

interface ServiceTypeTableRowProps {
  serviceTypes: {
    id: string
    name: string
  }
}

function ServiceTypeId({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-1">
      <code className="truncate rounded-sm bg-muted px-1.5 py-0.5 font-mono text-muted-foreground text-xs">
        {id}
      </code>
      <CopyContentField value={id} label="Copiar identificador" />
    </div>
  )
}

export function ServicesTypesTableRow({
  serviceTypes,
}: ServiceTypeTableRowProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <TableRow key={serviceTypes.id}>
      <TableCell>
        <div className="flex max-w-56 items-center gap-1 sm:max-w-md lg:max-w-xl">
          <span className="truncate font-medium">{serviceTypes.name}</span>
          <CopyContentField value={serviceTypes.name} label="Copiar nome" />
        </div>

        {/* Em telas estreitas o identificador vem para baixo do nome */}
        <div className="md:hidden">
          <ServiceTypeId id={serviceTypes.id} />
        </div>
      </TableCell>

      <TableCell className="hidden md:table-cell">
        <ServiceTypeId id={serviceTypes.id} />
      </TableCell>

      <TableCell className="text-right">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Pencil />
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
