'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { CirclePlus, UserSearch } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const newServiceFormSchema = z.object({
  oab: z.string().min(1, {
    message: 'O número da OAB é obrigatório',
  }),
  serviceTypeId: z.array(z.string()).min(1, {
    message: 'Selecione pelo menos um tipo de serviço',
  }),
  observation: z.string().optional(),
  assistance: z.enum(['PERSONALLY', 'REMOTELY']).optional(),
})

type NewServiceFormType = z.infer<typeof newServiceFormSchema>

export function NewService() {
  const form = useForm<NewServiceFormType>({
    shouldUnregister: true,
    resolver: zodResolver(newServiceFormSchema),
    defaultValues: {
      oab: '',
      serviceTypeId: [],
      observation: '',
      assistance: undefined,
    },
  })

  function handleCreateNewService(data: NewServiceFormType) {
    console.log(data)
    // Aqui você pode implementar a lógica para enviar os dados
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-sky-700 flex items-center cursor-pointer rounded text-white hover:bg-sky-600">
          <CirclePlus className="size-5" />
          Novo Atendimento
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md md:max-w-2xl overflow-y-auto px-4 rounded">
        <DialogHeader className="mt-4">
          <DialogTitle className="font-calsans text-2xl">
            Novo Atendimento
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha as informações para registrar um novo atendimento
          </DialogDescription>
        </DialogHeader>

        <Separator orientation="horizontal" />

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateNewService)}
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

            <Button
              type="submit"
              className="bg-sky-700 hover:bg-sky-600 text-white cursor-pointer rounded w-full"
            >
              <UserSearch className="size-4" />
              Buscar Advogado(a)
            </Button>
          </form>
        </Form>

        {/* <div className="w-full">
              <FormField
                control={form.control}
                name="assistance"
                render={({ field }) => (
                  <FormItem className="w-full">
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
                        <SelectItem value="REMOTELY">Remoto</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
            /> */}

        {/* <DialogFooter className="flex items-center justify-end mt-8 flex-row gap-2 p-0">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="cursor-pointer rounded"
                >
                  Cancelar
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-sky-700 hover:bg-sky-600 text-white cursor-pointer rounded"
              >
                <SquarePen className="size-4" />
                Criar Atendimento
              </Button>
            </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
