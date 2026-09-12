'use client'

import { FilterInput } from '@/components/app/filter-input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Fingerprint, Search, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const typesTableFiltersSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
})

type TypesTableFiltersType = z.infer<typeof typesTableFiltersSchema>

export function TypesTableFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const id = searchParams.get('id')
  const name = searchParams.get('name')

  const form = useForm<TypesTableFiltersType>({
    resolver: zodResolver(typesTableFiltersSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  })

  function handleFilterTypeService({ id, name }: TypesTableFiltersType) {
    const url = new URLSearchParams(searchParams.toString())

    if (id) url.set('id', id.toString())
    else url.delete('id')

    if (name) url.set('name', name.toString())
    else url.delete('name')

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
        onSubmit={form.handleSubmit(handleFilterTypeService)}
        className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap sm:items-center"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="sm:w-72 lg:w-80">
              <FormControl>
                <FilterInput {...field} placeholder="Nome do Serviço" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="sm:w-56 lg:w-72">
              <FormControl>
                <FilterInput
                  {...field}
                  icon={Fingerprint}
                  placeholder="Identificador"
                  className="font-mono placeholder:font-sans"
                />
              </FormControl>
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
