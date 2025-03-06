'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, X } from 'lucide-react'

export function ServiceTableFilters() {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="Número OAB" className="h-8 w-36 rounded" />
      <Input
        placeholder="Nome do advogado(a)"
        className="h-8 w-[350px] rounded"
      />
      <Input placeholder="Funcionário(a)" className="h-8 w-[350px] rounded" />

      <Select>
        <SelectTrigger className="h-8 w-36 rounded">
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="OPEN">Em andamento</SelectItem>
          <SelectItem value="COMPLETED">Concluído</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="h-8 w-36 rounded">
          <SelectValue placeholder="Atendimento" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="PERSONALLY">Presencial</SelectItem>
          <SelectItem value="REMOTE">Remoto</SelectItem>
        </SelectContent>
      </Select>

      <Button
        type="submit"
        size="sm"
        className="cursor-pointer rounded bg-sky-700 hover:bg-sky-600 text-white"
      >
        <Search className="size-4" />
        Filtrar resultados
      </Button>

      <Button
        type="button"
        size="sm"
        variant="outline"
        className="cursor-pointer rounded"
      >
        <X className="size-4" />
        Remover filtros
      </Button>
    </form>
  )
}
