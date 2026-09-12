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
import { Hash, Search, UserRound, X } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const serviceTableFiltersSchema = z.object({
  oab: z.string().optional(),
  lawyerName: z.string().optional(),
  agentName: z.string().optional(),
  assistance: z.string().optional(),
  status: z.string().optional(),
})

type ServiceTableFiltersType = z.infer<typeof serviceTableFiltersSchema>

export function ServiceTableFilters() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const oab = searchParams.get('oab')
  const lawyerName = searchParams.get('lawyerName')
  const agentName = searchParams.get('agentName')
  const assistance = searchParams.get('assistance')
  const status = searchParams.get('status')

  const form = useForm<ServiceTableFiltersType>({
    resolver: zodResolver(serviceTableFiltersSchema),
    defaultValues: {
      oab: oab ?? '',
      lawyerName: lawyerName ?? '',
      agentName: agentName ?? '',
      assistance: assistance ?? '',
      status: status ?? '',
    },
  })

  function handleFilterServices({
    oab,
    lawyerName,
    agentName,
    assistance,
    status,
  }: ServiceTableFiltersType) {
    const url = new URLSearchParams(searchParams.toString())

    if (oab) url.set('oab', oab.toString())
    else url.delete('oab')

    if (lawyerName) url.set('lawyerName', lawyerName.toString())
    else url.delete('lawyerName')

    if (agentName) url.set('agentName', agentName.toString())
    else url.delete('agentName')

    if (assistance) url.set('assistance', assistance.toString())
    else url.delete('assistance')

    if (status) url.set('status', status.toString())
    else url.delete('status')

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
        onSubmit={form.handleSubmit(handleFilterServices)}
        className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center"
      >
        <FormField
          control={form.control}
          name="oab"
          render={({ field }) => (
            <FormItem className="lg:w-32">
              <FormControl>
                <FilterInput {...field} icon={Hash} placeholder="Número OAB" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lawyerName"
          render={({ field }) => (
            <FormItem className="lg:min-w-56 lg:flex-1">
              <FormControl>
                <FilterInput {...field} placeholder="Nome do advogado(a)" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agentName"
          render={({ field }) => (
            <FormItem className="lg:w-44">
              <FormControl>
                <FilterInput
                  {...field}
                  icon={UserRound}
                  placeholder="Funcionário(a)"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="lg:w-36">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="OPEN">Em andamento</SelectItem>
                  <SelectItem value="COMPLETED">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="assistance"
          render={({ field }) => (
            <FormItem className="lg:w-32">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Atendimento" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="PERSONALLY">Presencial</SelectItem>
                  <SelectItem value="REMOTE">Remoto</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex gap-2 sm:col-span-2">
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
