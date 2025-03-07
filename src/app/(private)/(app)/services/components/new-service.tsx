'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'

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

      <form className="space-y-4 mt-4">
        <div>
          <Label htmlFor="oab">OAB</Label>
          <Input id="oab" placeholder="12345" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="serviceType">Tipo de Serviço</Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione um tipo de serviço" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cm79sstmi0000i3m028engmfh">
                Consulta Jurídica
              </SelectItem>
              <SelectItem value="cm7cm3vwz0000i39f7i5dnj9t">
                Elaboração de Contratos
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="assistance">Forma de Atendimento</Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione a forma de atendimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERSONALLY">Presencial</SelectItem>
              <SelectItem value="ONLINE">Online</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="observation">Observações</Label>
          <Textarea
            id="observation"
            placeholder="Detalhes adicionais sobre o atendimento"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecione o status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Aberto</SelectItem>
              <SelectItem value="CLOSED">Fechado</SelectItem>
              <SelectItem value="IN_PROGRESS">Em Andamento</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="my-4" />

        <div className="flex justify-end">
          <Button className="bg-slate-800 text-white hover:bg-slate-700">
            Salvar Atendimento
          </Button>
        </div>
      </form>
    </SheetContent>
  )
}
