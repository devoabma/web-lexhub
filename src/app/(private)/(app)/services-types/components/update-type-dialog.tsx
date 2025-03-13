'use client'

import { updateServiceType } from '@/api/services-types/update-type'
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
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { LoaderCircle, Save } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const updateServiceTypeFormSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1, 'O nome é obrigatório.'),
})

type UpdateServiceTypeFormType = z.infer<typeof updateServiceTypeFormSchema>

interface UpdateServiceTypeProps {
  serviceTypes: {
    id: string
    name: string
  }
  onOpenChange: (open: boolean) => void
}

export function UpdateServiceTypeDialog({
  serviceTypes: { id, name },
  onOpenChange,
}: UpdateServiceTypeProps) {
  const form = useForm<UpdateServiceTypeFormType>({
    resolver: zodResolver(updateServiceTypeFormSchema),
    values: {
      id,
      name,
    },
  })

  async function handleUpdateServiceType(data: UpdateServiceTypeFormType) {
    try {
      await updateServiceTypeFn({
        id: data.id,
        name: data.name,
      })

      // Fechar o Dialog quando o tipo de serviço for atualizado
      onOpenChange(false)

      toast.success('Tipo de Serviço atualizado com sucesso!', {
        description: 'Confira as informações do tipo na lista de serviços.',
      })
    } catch (err) {
      // FIXME: Tratar erros vindo da API
      form.reset()

      if (isAxiosError(err)) {
        toast.error('Houve um erro ao atualizar tipo de serviço!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Houve um erro ao atualizar tipo de serviço!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  const queryClient = useQueryClient()
  const { mutateAsync: updateServiceTypeFn, isPending: isLoadingUpdating } =
    useMutation({
      mutationFn: updateServiceType,
      onSuccess: () =>
        queryClient.invalidateQueries({ queryKey: ['services-types'] }),
    })
  return (
    <DialogContent className="w-[90%] rounded">
      <DialogHeader>
        <DialogTitle className="font-calsans text-2xl">
          Editar Tipo de Serviço
        </DialogTitle>
        <DialogDescription>
          Altere os dados do tipo de serviço conforme necessário.
        </DialogDescription>
      </DialogHeader>

      <Separator orientation="horizontal" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateServiceType)}>
          <div className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded" />
                  </FormControl>

                  {errors.name ? (
                    <FormMessage className="text-red-500 text-xs">
                      {errors.name.message}
                    </FormMessage>
                  ) : (
                    <FormDescription className="text-muted-foreground text-xs">
                      Por favor, insira o nome completo do tipo de serviço.
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          </div>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button
                variant="ghost"
                type="button"
                className="rounded cursor-pointer"
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={isLoadingUpdating}
              className="bg-sky-700 hover:bg-sky-600 text-white cursor-pointer rounded"
            >
              {isLoadingUpdating ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Aplicando mudanças...
                </>
              ) : (
                <>
                  <Save className="size-4" />
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
