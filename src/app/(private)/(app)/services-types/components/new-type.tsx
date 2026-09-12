'use client'

import { createServiceType } from '@/api/services-types/create-type'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
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
import { useIsMobile } from '@/hooks/use-mobile'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { ListPlus, LoaderCircle, Plus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const newServiceTypeFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
})

type NewServiceTypeFormType = z.infer<typeof newServiceTypeFormSchema>

export function NewServiceType() {
  // FIXME: Guardará o estado do Drawer se ele estiver aberto ou fechado
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)

  // Drawer lateral no desktop e inferior no celular
  const isMobile = useIsMobile()

  const form = useForm<NewServiceTypeFormType>({
    shouldUnregister: true, // Desregistrar o campo do formulário
    resolver: zodResolver(newServiceTypeFormSchema),
    defaultValues: {
      name: '',
    },
  })

  // FIXME: Mutation para criar um novo serviço
  const queryClient = useQueryClient()
  const { mutateAsync: createServiceTypeFn, isPending: isCreating } =
    useMutation({
      mutationFn: createServiceType,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services-types'] })
      },
    })

  async function handleCreateServiceType(data: NewServiceTypeFormType) {
    try {
      await createServiceTypeFn({
        name: data.name,
      })

      // Fechar o Drawer quando o serviço for registrado
      setDrawerIsOpen(false)

      toast.success('Novo serviço registrado com sucesso!', {
        description:
          'Confira as informações do novo serviço na lista de serviços.',
      })
    } catch (err) {
      form.reset()

      if (isAxiosError(err)) {
        toast.error('Houve um erro ao registrar o novo serviço!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Houve um erro ao registrar o novo serviço!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  return (
    <Drawer
      direction={isMobile ? 'bottom' : 'right'}
      open={drawerIsOpen}
      onOpenChange={setDrawerIsOpen}
    >
      <DrawerTrigger asChild>
        <Button>
          <Plus />
          Novo Serviço
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="border-b pr-12">
          <DrawerTitle>Novo Serviço</DrawerTitle>
          <DrawerDescription>
            Preencha as informações para registrar um novo serviço
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleCreateServiceType)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Nome do Serviço</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    {errors.name ? (
                      <FormMessage>{errors.name.message}</FormMessage>
                    ) : (
                      <FormDescription>
                        Por favor, insira o nome do novo serviço
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <DrawerFooter className="flex-row justify-end border-t">
              <DrawerClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DrawerClose>

              <Button type="submit" disabled={isCreating}>
                {isCreating ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <ListPlus />
                    Criar Novo
                  </>
                )}
              </Button>
            </DrawerFooter>
          </form>
        </Form>
      </DrawerContent>
    </Drawer>
  )
}
