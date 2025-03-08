'use client'

import { Separator } from '@/components/ui/separator'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export function NewService() {
  return (
    <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto px-4">
      <SheetHeader className="mt-4">
        <SheetTitle className="font-calsans text-2xl">
          Novo Atendimento
        </SheetTitle>
        <SheetDescription className="text-muted-foreground">
          Preencha as informações para registrar um novo atendimento
        </SheetDescription>
      </SheetHeader>

      <Separator orientation="horizontal" />
    </SheetContent>
  )
}
