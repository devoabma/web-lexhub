'use client'

import { FilterInput } from '@/components/app/filter-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const agentTableFiltersSchema = z.object({
  name: z.string().optional(),
  role: z.string().optional(),
})

type AgentTableFiltersType = z.infer<typeof agentTableFiltersSchema>

export function AgentTableFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const name = searchParams.get('name')
  const role = searchParams.get('role')

  const form = useForm<AgentTableFiltersType>({
    resolver: zodResolver(agentTableFiltersSchema),
    defaultValues: {
      name: name ?? '',
      role: role ?? '',
    },
  })

  function handleFilterAgent({ name, role }: AgentTableFiltersType) {
    const url = new URLSearchParams(searchParams.toString())

    if (name) url.set('name', name.toString())
    else url.delete('name')

    if (role) url.set('role', role.toString())
    else url.delete('role')

    // Reseta o parâmetro "page" para 1 quando os filtros mudam
    url.set('page', '1')

    // Atualiza a URL no navegador sem recarregar a página
    router.push(`?${url.toString()}`)
  }

  function handleClearFilters() {
    const url = new URLSearchParams()

    // Reseta o parâmetro "page" para 1 quando os filtros mudam
    url.set('page', '1')

    // Atualiza a URL no navegador sem recarregar a página
    router.push(`?${url.toString()}`)

    form.reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilterAgent)}
        className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="sm:w-64 lg:w-80">
              <FormControl>
                <FilterInput {...field} placeholder="Nome do Funcionário" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem className="sm:w-44">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Cargo" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="MEMBER">Membro</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="flex-1 sm:flex-none">
            <Search />
            Filtrar resultados
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="flex-1 text-muted-foreground sm:flex-none"
            onClick={handleClearFilters}
          >
            <X />
            Remover filtros
          </Button>
        </div>
      </form>
    </Form>
  )
}
