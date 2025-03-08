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

export function AgentTableFilters() {
  return (
    <form className="flex items-center gap-2">
      <span className="text-sm font-semibold">Filtros:</span>
      <Input placeholder="Nome do Funcionário" className="h-8 w-80 rounded" />
      <Select>
        <SelectTrigger className="h-8 w-40 rounded">
          <SelectValue placeholder="Cargo" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">Todos</SelectItem>
          <SelectItem value="ADMIN">Administrador</SelectItem>
          <SelectItem value="MEMBER">Membro</SelectItem>
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
