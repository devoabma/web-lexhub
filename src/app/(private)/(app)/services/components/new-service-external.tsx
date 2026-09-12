'use client'

import { getAllWithoutPagination } from '@/api/services-types/get-all-without-pagination'
import { createServiceExternal } from '@/api/services/create-service-external'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  Check,
  ChevronsUpDown,
  LoaderCircle,
  SquarePen,
  UserRoundPen,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const newServiceExternalFormSchema = z.object({
  oab: z.string().trim().min(1, {
    message: 'O número da OAB é obrigatório',
  }),
  name: z.string().min(1, {
    message: 'O nome do advogado(a) é obrigatório',
  }),
  email: z.string().email({
    message: 'O e-mail é obrigatório',
  }),
  serviceTypeId: z.array(z.string()).min(1, {
    message: 'Selecione pelo menos um tipo de serviço',
  }),
  observation: z.string().optional(),
  assistance: z.enum(['PERSONALLY', 'REMOTE'], {
    message: 'Selecione a forma de atendimento',
  }),
})

type NewServiceExternalFormType = z.infer<typeof newServiceExternalFormSchema>

export function NewServiceExternal() {
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([])

  const form = useForm<NewServiceExternalFormType>({
    shouldUnregister: true,
    resolver: zodResolver(newServiceExternalFormSchema),
    defaultValues: {
      oab: '',
      name: '',
      email: '',
      serviceTypeId: [],
      observation: '',
      assistance: undefined,
    },
  })

  // FIXME: Query para pegar os tipos de serviços
  const { data: results } = useQuery({
    queryKey: ['service-types'],
    queryFn: () => getAllWithoutPagination(),
    staleTime: Number.POSITIVE_INFINITY,
  })

  // FIXME: Mutation para criar um novo atendimento externo
  const queryClient = useQueryClient()
  const { mutateAsync: createServiceExternalFn, isPending: isCreating } =
    useMutation({
      mutationFn: createServiceExternal,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['service-types'] })
        queryClient.invalidateQueries({ queryKey: ['services'] })
      },
    })

  async function handleCreateNewServiceExternal(
    data: NewServiceExternalFormType
  ) {
    try {
      await createServiceExternalFn({
        oab: data.oab,
        name: data.name,
        email: data.email,
        serviceTypeId: selectedServiceTypes,
        observation: data.observation,
        assistance: data.assistance,
      })

      setIsOpenDialog(false)

      toast.success('Atendimento registrado com sucesso!', {
        description:
          'Confira as informações do atendimento na lista de atendimentos.',
      })
    } catch (err) {
      form.reset()

      if (isAxiosError(err)) {
        toast.error('Houve um erro ao registrar o atendimento externo!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Houve um erro ao registrar o atendimento externo!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  return (
    <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <UserRoundPen />
          Atendimento Externo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Atendimento Externo</DialogTitle>
          <DialogDescription>
            Preencha as informações para registrar um novo atendimento externo
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateNewServiceExternal)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="oab"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Número de Inscrição OAB</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Insira o e-mail</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assistance"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Forma do Atendimento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a forma do atendimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PERSONALLY">Presencial</SelectItem>
                      <SelectItem value="REMOTE">Remoto</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceTypeId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Tipo de Serviço</FormLabel>

                  <Dialog>
                    <DialogTrigger asChild>
                      <FormControl className="hover:bg-transparent">
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-between rounded',
                            !field.value.length && 'text-muted-foreground'
                          )}
                        >
                          {field.value.length > 0
                            ? `${field.value.length} serviço(s) selecionado(s)`
                            : 'Selecione os tipos de serviço'}
                          <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </DialogTrigger>

                    <DialogContent className="w-full py-2 px-0">
                      <DialogTitle className="sr-only">
                        Selecionar os tipos de serviços
                      </DialogTitle>

                      <Command>
                        <CommandInput
                          placeholder="Buscar tipo de serviço..."
                          className="max-h-64 overflow-y-auto"
                        />
                        <CommandList>
                          <CommandEmpty>
                            Nenhum serviço encontrado.
                          </CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-y-auto">
                            {results?.servicesTypes.map(type => (
                              <CommandItem
                                key={type.id}
                                value={type.name}
                                onSelect={() => {
                                  const newValue = [...field.value]
                                  const index = newValue.indexOf(type.id)
                                  if (index === -1) {
                                    newValue.push(type.id)
                                  } else {
                                    newValue.splice(index, 1)
                                  }
                                  field.onChange(newValue)

                                  // Recebe os tipos de serviços selecionados
                                  setSelectedServiceTypes(newValue)
                                }}
                              >
                                <Check
                                  className={cn(
                                    'size-4',
                                    field.value.includes(type.id)
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                                {type.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </DialogContent>
                  </Dialog>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Adicione informações relevantes sobre o atendimento"
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-2">
              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <>
                    <SquarePen />
                    Criar Atendimento
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
