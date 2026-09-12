'use client'

import { updateAgent } from '@/api/agents/update-agent'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { LoaderCircle, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const UpdateAgentFormSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, 'O nome é obrigatório.'),
  email: z.string().email('Insira um endereço de e-mail válido.'),
  role: z.enum(['ADMIN', 'MEMBER']),
})

type UpdateAgentFormType = z.infer<typeof UpdateAgentFormSchema>

interface UpdateAgentProps {
  agents: {
    id: string
    name: string
    email: string
    role: 'ADMIN' | 'MEMBER'
  }
  onOpenChange: (open: boolean) => void
}

export function UpdateAgentDialog({ agents, onOpenChange }: UpdateAgentProps) {
  const form = useForm<UpdateAgentFormType>({
    resolver: zodResolver(UpdateAgentFormSchema),
    values: {
      id: agents.id,
      name: agents.name,
      email: agents.email,
      role: agents.role,
    },
  })

  // FIXME: Mutation para atualizar um funcionário
  const queryClient = useQueryClient()
  const { mutateAsync: updateAgentFn, isPending: isLoadindUpdate } =
    useMutation({
      mutationFn: updateAgent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['agents'] })
      },
    })

  async function handleUpdateAgent(data: UpdateAgentFormType) {
    try {
      await updateAgentFn({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      })

      // Fechar o Dialog quando o funcionário for atualizado
      onOpenChange(false)

      toast.success('Funcionário atualizado com sucesso!', {
        description:
          'Confira as informações do colaborador na lista de funcionários.',
      })
    } catch (err) {
      // FIXME: Tratar erros vindo da API
      form.reset()

      if (isAxiosError(err)) {
        toast.error('Houve um erro ao atualizar o funcionário!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Houve um erro ao atualizar o funcionário!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Editar Informações do Funcionário</DialogTitle>
        <DialogDescription>
          Altere os dados do funcionário conforme necessário.
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateAgent)}>
          <div className="py-2">
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
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
                    <FormLabel>E-mail cadastrado</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>

                    {errors.email ? (
                      <FormMessage>{errors.email.message}</FormMessage>
                    ) : (
                      <FormDescription>
                        Insira o novo endereço de e-mail do funcionário
                      </FormDescription>
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cargo Atual</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent defaultValue={field.value}>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        <SelectItem value="MEMBER">Membro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </DialogClose>

            <Button type="submit" disabled={isLoadindUpdate}>
              {isLoadindUpdate ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Aplicando mudanças...
                </>
              ) : (
                <>
                  <Save />
                  Salvar alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}
