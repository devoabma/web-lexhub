'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { Search, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const typesTableFiltersSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
})

type TypesTableFiltersType = z.infer<typeof typesTableFiltersSchema>

export function TypesTableFilters() {
  const form = useForm<TypesTableFiltersType>({
    resolver: zodResolver(typesTableFiltersSchema),
    defaultValues: {
      id: '',
      name: '',
    },
  })

  function handleFilterTypeService(data: TypesTableFiltersType) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFilterTypeService)}
        className="flex items-center gap-2"
      >
        <span className="text-sm font-semibold">Filtros:</span>

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Identificador"
                  className="h-8 w-80 rounded"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do Serviço"
                  className="h-8 w-xl rounded"
                />
              </FormControl>
            </FormItem>
          )}
        />

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
    </Form>
  )
}
