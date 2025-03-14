'use client'

import { consultLawyer } from '@/api/services/consult-lawyer'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import {
  CirclePlus,
  InfoIcon,
  LoaderCircle,
  SquarePen,
  UserSearch,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { getAll } from '@/api/services-types/get-all'

const consultLawyerFormSchema = z.object({
  oab: z.string().min(1, {
    message: 'O número da OAB é obrigatório',
  }),
})

type ConsultLawyerFormType = z.infer<typeof consultLawyerFormSchema>

const newServiceFormSchema = z.object({
  oab: z.string().min(1, {
    message: 'O número da OAB é obrigatório',
  }),
  serviceTypeId: z.array(z.string()).min(1, {
    message: 'Selecione pelo menos um tipo de serviço',
  }),
  observation: z.string().optional(),
  assistance: z.enum(['PERSONALLY', 'REMOTE']).optional(),
})

type NewServiceFormType = z.infer<typeof newServiceFormSchema>

export function NewService() {
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

  // FIXME: Mutation para consultar o advogado a partir da OAB
  const {
    mutateAsync: consultLawyerFn,
    isPending: isConsulting,
    isError,
    isSuccess,
    reset,
  } = useMutation({
    mutationFn: consultLawyer,
  })

  async function handleSearchLawyer(data: ConsultLawyerFormType) {
    try {
      await consultLawyerFn({ oab: data.oab })
      formNewService.setValue('oab', data.oab)
    } catch (err) {
      formConsultLawyer.reset()

      if (isAxiosError(err)) return

      toast.error('Houve um erro ao consultar o advogado(a)!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  function handleCreateNewService(data: NewServiceFormType) {
    console.log(data)
  }

  return (
    <Dialog
      onOpenChange={isOpen => {
        if (!isOpen) {
          reset()
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-sky-700 flex items-center cursor-pointer rounded text-white hover:bg-sky-600">
          <CirclePlus className="size-5" />
          Novo Atendimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-lg overflow-y-auto px-4 rounded">
        <DialogHeader className="mt-4">
          <DialogTitle className="font-calsans text-2xl">
            Novo Atendimento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha as informações para registrar um novo atendimento
          </DialogDescription>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <Form {...formConsultLawyer}>
          <form
            onSubmit={formConsultLawyer.handleSubmit(handleSearchLawyer)}
            className="space-y-6 pt-2"
          >
            <FormField
              control={formConsultLawyer.control}
              name="oab"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Número de Inscrição OAB</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded" />
                  </FormControl>

                  {errors.oab ? (
                    <FormMessage className="text-red-500 text-xs">
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

            {isError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                <Alert
                  variant="destructive"
                  className="rounded border border-amber-800 bg-amber-50 text-amber-800"
                >
                  <InfoIcon />
                  <AlertTitle className="font-medium">
                    Aviso Importante
                  </AlertTitle>
                  <AlertDescription className="text-sm text-justify">
                    Prezado(a) advogado(a), no momento, não podemos prosseguir
                    com o atendimento. Para mais informações, entre em contato
                    com o Setor Financeiro.
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={isConsulting}
              className="bg-sky-700 hover:bg-sky-600 text-white cursor-pointer rounded w-full"
            >
              {isConsulting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Consultando informações...
                </>
              ) : (
                <>
                  <UserSearch className="size-4" />
                  Buscar Advogado(a)
                </>
              )}
            </Button>
          </form>
        </Form>

        {isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Form {...formNewService}>
              <form
                onSubmit={formNewService.handleSubmit(handleCreateNewService)}
                className="space-y-6 pt-2"
              >
                <FormField
                  control={formNewService.control}
                  name="assistance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Forma do Atendimento</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded w-full">
                            <SelectValue placeholder="Selecione a forma do atendimento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded">
                          <SelectItem value="PERSONALLY">Presencial</SelectItem>
                          <SelectItem value="REMOTE">Remoto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
                    className="bg-sky-700 hover:bg-sky-600 text-white"
                  >
                    <SquarePen className="size-4" />
                    Criar Atendimento
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
