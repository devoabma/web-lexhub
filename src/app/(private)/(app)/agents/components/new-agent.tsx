'use client'

import { createAgent } from '@/api/agents/create'
import { PasswordInput } from '@/components/app/password-input'
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
import { LoaderCircle, Plus, UserRoundPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const NewAgentFormSchema = z.object({
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('Insira um endereço de e-mail válido.'),
  password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.'),
})

type NewAgentFormType = z.infer<typeof NewAgentFormSchema>

export function NewAgent() {
  // FIXME: Guardará o estado do Drawer se ele estiver aberto ou fechado
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)

  // Drawer lateral no desktop e inferior no celular
  const isMobile = useIsMobile()

  const form = useForm<NewAgentFormType>({
    shouldUnregister: true, // Desregistrar o campo do formulário
    resolver: zodResolver(NewAgentFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '@102030@',
    },
  })

  // FIXME: Mutation para criar um novo funcionário
  const queryClient = useQueryClient()
  const { mutateAsync: createAgentFn, isPending: isCreating } = useMutation({
    mutationFn: createAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  async function handleNewAgent(data: NewAgentFormType) {
    try {
      await createAgentFn({
        name: data.name,
        email: data.email,
        password: data.password,
      })

      // Fechar o Drawer quando o funcionário for registrado
      setDrawerIsOpen(false)

      toast.success('Funcionário registrado com sucesso!', {
        description:
          'Confira as informações do colaborador na lista de funcionários.',
      })
    } catch (err) {
      // FIXME: Tratar erros vindo da API
      form.reset()

      if (isAxiosError(err)) {
        toast.error('Houve um erro ao registrar o funcionário!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Houve um erro ao registrar o funcionário!', {
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
          Novo Funcionário
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="border-b pr-12">
          <DrawerTitle>Novo Funcionário</DrawerTitle>
          <DrawerDescription>
            Preencha as informações para registrar um novo funcionário
          </DrawerDescription>
        </DrawerHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleNewAgent)}
            className="flex min-h-0 flex-1 flex-col"
          >
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Nome completo</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    {errors.name ? (
                      <FormMessage>{errors.name.message}</FormMessage>
                    ) : (
                      <FormDescription>
                        Por favor, insira o nome completo do funcionário
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>E-mail para acesso</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    {errors.email ? (
                      <FormMessage>{errors.email.message}</FormMessage>
                    ) : (
                      <FormDescription>
                        Por favor, insira o e-mail do funcionário validado
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Senha provisória</FormLabel>
                    <FormControl>
                      <PasswordInput {...field} />
                    </FormControl>

                    {errors.password ? (
                      <FormMessage>{errors.password.message}</FormMessage>
                    ) : (
                      <FormDescription>
                        Senha padrão provisória definida: <b>@102030@</b>
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
                    Criando e enviando e-mail...
                  </>
                ) : (
                  <>
                    <UserRoundPlus />
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
