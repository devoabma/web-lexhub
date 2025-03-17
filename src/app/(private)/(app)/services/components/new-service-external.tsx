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
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Check, ChevronsUpDown, SquarePen } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { PatternFormat } from 'react-number-format'
import { toast } from 'sonner'
import { z } from 'zod'

const newServiceExternalFormSchema = z.object({
  oab: z.string().min(1, {
    message: 'O número da OAB é obrigatório',
  }),
  name: z.string().min(1, {
    message: 'O nome do advogado(a) é obrigatório',
  }),
  cpf: z.string().min(1, {
    message: 'O número do CPF é obrigatório',
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
      cpf: '',
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
  const { mutateAsync: createServiceExternalFn } = useMutation({
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
        cpf: data.cpf,
        email: data.email,
        serviceTypeId: selectedServiceTypes,
        observation: data.observation,
        assistance: data.assistance,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center cursor-pointer rounded text-muted-foreground"
        >
          Atendimento Externo
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md md:max-w-lg overflow-y-auto px-4 rounded">
        <DialogHeader className="mt-4">
          <DialogTitle className="font-calsans text-2xl">
            Novo Atendimento Externo
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha as informações para registrar um novo atendimento externo
          </DialogDescription>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateNewServiceExternal)}
            className="space-y-6 pt-2"
          >
            <FormField
              control={form.control}
              name="oab"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Número de Inscrição OAB</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded" />
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
                    <Input {...field} className="rounded" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cpf"
              render={({
                field: { onChange, ...field },
                formState: { errors },
              }) => (
                <FormItem>
                  <FormLabel>Número de CPF</FormLabel>
                  <FormControl>
                    <PatternFormat
                      format="###.###.###-##"
                      name={field.name}
                      value={field.value}
                      onValueChange={values => {
                        onChange(values.value)
                      }}
                      defaultValue=""
                      autoComplete="off"
                      allowEmptyFormatting={false}
                      data-error={Boolean(errors.cpf)}
                      className="flex h-9 w-full rounded border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[error=true]:border-red-600 data-[error=true]:focus-visible:ring-0"
                    />
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
                    <Input {...field} className="rounded" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="serviceTypeId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Tipo de Serviço</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="rounded hover:bg-transparent">
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
                          <ChevronsUpDown className="ml-2 size-4 rounded shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>

                    <PopoverContent className="w-full p-0 rounded">
                      <Command>
                        <CommandInput
                          placeholder="Buscar tipo de serviço..."
                          className="h-9 w-full"
                        />
                        <CommandList className="rounded">
                          <CommandEmpty>
                            Nenhum serviço encontrado.
                          </CommandEmpty>
                          <CommandGroup className="max-h-64 overflow-y-auto rounded">
                            {results?.servicesTypes.map(type => (
                              <CommandItem
                                className="cursor-pointer rounded"
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
                    </PopoverContent>
                  </Popover>
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
                    <FormControl className="rounded">
                      <SelectTrigger className="rounded w-full">
                        <SelectValue placeholder="Selecione a forma do atendimento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="rounded">
                      <SelectItem value="PERSONALLY">Presencial</SelectItem>
                      <SelectItem value="REMOTE">Remoto</SelectItem>
                    </SelectContent>
                  </Select>
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
                      className="resize-none rounded min-h-24"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex items-center justify-end mt-8 flex-row gap-2 p-0">
              <DialogClose asChild>
                <Button type="button" variant="ghost">
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                // disabled={isCreating}
                className="bg-sky-700 hover:bg-sky-600 text-white cursor-pointer rounded"
              >
                {/* {isCreating ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Registrando...
                  </>
                ) : (
                  <> */}
                <SquarePen className="size-4" />
                Criar Atendimento
                {/* </>
                )} */}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
