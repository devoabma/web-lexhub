'use client'

import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
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
        className="flex flex-wrap items-center gap-2"
      >
        <span className="text-sm font-semibold">Filtros:</span>

        <FormField
          control={form.control}
          name="oab"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Número OAB"
                  className="h-8 w-full sm:w-36 text-sm rounded"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lawyerName"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Nome do advogado(a)"
                  className="h-8 w-full sm:w-[350px] text-sm rounded"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agentName"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <FormControl>
                <Input
                  {...field}
                  placeholder="Funcionário(a)"
                  className="h-8 w-full sm:w-[350px] text-sm rounded"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full sm:w-auto">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8 w-full sm:w-36 rounded">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="rounded">
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
            <FormItem className="w-full sm:w-auto">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="h-8 w-full sm:w-36 rounded">
                    <SelectValue placeholder="Atendimento" />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="rounded">
                  <SelectItem value="ALL">Todos</SelectItem>
                  <SelectItem value="PERSONALLY">Presencial</SelectItem>
                  <SelectItem value="REMOTE">Remoto</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="flex w-full sm:w-auto max-sm:flex-col gap-2">
          <Button
            type="submit"
            size="sm"
            className="w-full sm:w-auto cursor-pointer rounded bg-sky-700 hover:bg-sky-600 text-white flex items-center gap-2"
          >
            <Search className="size-4" />
            Filtrar resultados
          </Button>

          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-full sm:w-auto cursor-pointer rounded flex items-center gap-2"
            onClick={handleClearFilters}
          >
            <X className="size-4" />
            Remover filtros
          </Button>
        </div>
      </form>
    </Form>
  )
}
