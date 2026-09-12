'use client'

import { getAllWithoutPagination } from '@/api/services-types/get-all-without-pagination'
import { consultLawyer } from '@/api/services/consult-lawyer'
import { createService } from '@/api/services/create-service'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
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
  FormDescription,
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
import { formatFullName } from '@/utils/format-full-name'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { motion } from 'framer-motion'
import {
  Check,
  CheckCircle,
  ChevronsUpDown,
  InfoIcon,
  LoaderCircle,
  Plus,
  SquarePen,
  UserSearch,
} from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const consultLawyerFormSchema = z.object({
  oab: z.string().trim().min(1, {
    message: 'O número da OAB é obrigatório',
  }),
})

type ConsultLawyerFormType = z.infer<typeof consultLawyerFormSchema>

const newServiceFormSchema = z.object({
  oab: z.string().trim().min(1, {
    message: 'O número da OAB é obrigatório',
  }),
  serviceTypeId: z.array(z.string()).min(1, {
    message: 'Selecione pelo menos um tipo de serviço',
  }),
  observation: z.string().optional(),
  assistance: z.enum(['PERSONALLY', 'REMOTE'], {
    message: 'Selecione a forma de atendimento',
  }),
})

type NewServiceFormType = z.infer<typeof newServiceFormSchema>

interface NewServiceResponse {
  name: string
}

export function NewService() {
  const [isOpenDialog, setIsOpenDialog] = useState(false)
  const [isOpenPopover, setIsOpenPopover] = useState(false)
  const [isNameResponse, setIsNameResponse] = useState<string | null>()
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<string[]>([])
  const [isMessageErrorApi, setIsMessageErrorApi] = useState<string | null>(
    null
  )

  const formConsultLawyer = useForm<ConsultLawyerFormType>({
    shouldUnregister: true,
    resolver: zodResolver(consultLawyerFormSchema),
    defaultValues: {
      oab: '',
    },
  })

  const formNewService = useForm<NewServiceFormType>({
    shouldUnregister: true,
    resolver: zodResolver(newServiceFormSchema),
    defaultValues: {
      oab: '',
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

  // FIXME: Mutation para consultar o advogado a partir da OAB
  const {
    mutateAsync: consultLawyerFn,
    isPending: isConsulting,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: consultLawyer,
    onSuccess: () => {
      formNewService.reset()
    },
  })

  // FIXME: Mutation para criar um novo atendimento
  const queryClient = useQueryClient()
  const { mutateAsync: createNewServiceFn, isPending: isCreating } =
    useMutation({
      mutationFn: createService,
      onSuccess: () => {
        formNewService.reset()
        reset()
        queryClient.invalidateQueries({ queryKey: ['service-types'] })
        queryClient.invalidateQueries({ queryKey: ['services'] })
      },
    })

  async function handleSearchLawyer(data: ConsultLawyerFormType) {
    try {
      const { name } = (await consultLawyerFn({
        oab: data.oab,
      })) as NewServiceResponse

      setIsNameResponse(name)

      setIsMessageErrorApi(null)

      // Setar a oab do advogado no formulário de novo atendimento
      formNewService.setValue('oab', data.oab)
    } catch (err) {
      formConsultLawyer.reset()

      setIsNameResponse('')

      if (isAxiosError(err)) {
        setIsMessageErrorApi(err.response?.data.message)

        return
      }

      toast.error('Houve um erro ao consultar o advogado(a)!', {
        description: 'Por favor, tente novamente mais tarde.',
      })

      console.log(err)
    }
  }

  async function handleCreateNewService(data: NewServiceFormType) {
    try {
      await createNewServiceFn({
        oab: data.oab,
        serviceTypeId: selectedServiceTypes,
        observation: data.observation,
        assistance: data.assistance,
      })

      setIsOpenDialog(false)
      setIsNameResponse('')

      toast.success('Atendimento registrado com sucesso!', {
        description:
          'Confira as informações do atendimento na lista de atendimentos.',
      })

      // Fechar o Sheet quando o atendimento for registrado
      setIsOpenPopover(false)
    } catch (err) {
      formNewService.reset()

      if (isAxiosError(err)) {
        toast.error('Houve um erro ao registrar o atendimento!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Houve um erro ao registrar o atendimento!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  return (
    <Dialog
      open={isOpenDialog}
      onOpenChange={isOpen => {
        if (!isOpen) {
          reset()
          formConsultLawyer.reset()
          setIsMessageErrorApi(null)
          setIsNameResponse('')
        }

        setIsOpenDialog(isOpen)
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Novo Atendimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Novo Atendimento</DialogTitle>
          <DialogDescription>
            Preencha as informações para registrar um novo atendimento
          </DialogDescription>
        </DialogHeader>

        <Form {...formConsultLawyer}>
          <form
            onSubmit={formConsultLawyer.handleSubmit(handleSearchLawyer)}
            className="space-y-4"
          >
            <FormField
              control={formConsultLawyer.control}
              name="oab"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Número de Inscrição OAB</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  {errors.oab ? (
                    <FormMessage className="text-xs">
                      {errors.oab.message}
                    </FormMessage>
                  ) : (
                    <FormDescription className="text-muted-foreground text-xs">
                      Consulte um advogado(a) existente na OAB
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />

            {isNameResponse && (
              <Alert className="rounded-md border-success/40 bg-success/10 p-2 text-success">
                <AlertTitle className="flex items-center justify-center gap-1">
                  <CheckCircle className="size-4" />
                  {formatFullName(isNameResponse)}
                </AlertTitle>
              </Alert>
            )}

            {isMessageErrorApi && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                <Alert className="rounded-md border-warning/40 bg-warning/10 text-warning *:data-[slot=alert-description]:text-warning">
                  <InfoIcon />
                  <AlertDescription className="text-sm font-medium text-justify">
                    {isMessageErrorApi}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Button type="submit" disabled={isConsulting} className="w-full">
              {isConsulting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Consultando informações...
                </>
              ) : (
                <>
                  <UserSearch />
                  Buscar Advogado(a)
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* FIXME: Componente de Novo Servico se tiver advogado selecionado e adimplente */}
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <Form {...formNewService}>
              <form
                onSubmit={formNewService.handleSubmit(handleCreateNewService)}
                className="space-y-4"
              >
                <FormField
                  control={formNewService.control}
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

                      {errors.assistance && (
                        <FormMessage className="text-xs">
                          {errors.assistance.message}
                        </FormMessage>
                      )}
                    </FormItem>
                  )}
                />

                <FormField
                  control={formNewService.control}
                  name="serviceTypeId"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Tipo de Serviço</FormLabel>

                      <Dialog
                        open={isOpenPopover}
                        onOpenChange={setIsOpenPopover}
                      >
                        <DialogTrigger asChild>
                          <FormControl>
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
                              <ChevronsUpDown className="ml-2 size-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </DialogTrigger>

                        <DialogContent className="w-full py-2 px-0">
                          <DialogTitle className="sr-only">
                            Selecionar Tipo de Serviço
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
                              <CommandGroup>
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
                  control={formNewService.control}
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
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
