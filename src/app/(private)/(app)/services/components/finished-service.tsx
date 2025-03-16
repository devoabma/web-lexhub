'use client'

import { finishedService } from '@/api/services/finished-service'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

interface FinishedServiceProps {
  services: {
    id: string
  }
  onOpenChange: (open: boolean) => void
}

export function FinishedService({
  services,
  onOpenChange,
}: FinishedServiceProps) {
  // FIXME: Mutation para se concluir atendimento
  const queryClient = useQueryClient()
  const { mutateAsync: finishedServiceFn, isPending: isFinishing } =
    useMutation({
      mutationFn: finishedService,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] })
      },
    })

  async function handleFinishedService() {
    try {
      await finishedServiceFn({
        id: services.id,
      })

      onOpenChange(false)

      toast.success('Atendimento concluído com sucesso!', {
        description: 'Ótimo trabalho! Continue assim.',
      })
    } catch (err) {
      toast.error('Erro ao concluir atendimento', {
        description:
          'Não foi possível finalizar o atendimento. Tente novamente.',
      })
    }
  }

  return (
    <DialogContent className="rounded-2xl">
      <DialogHeader>
        <DialogTitle>Concluir Atendimento</DialogTitle>
        <DialogDescription>
          O atendimento será finalizado. Deseja continuar?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" className="rounded cursor-pointer">
            Cancelar
          </Button>
        </DialogClose>
        <Button
          className="rounded cursor-pointer bg-emerald-700 hover:bg-emerald-600 text-white"
          disabled={isFinishing}
          onClick={handleFinishedService}
        >
          {!isFinishing ? (
            <>
              <CheckCircle className="size-4" />
              Concluir Atendimento
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin" />
              Concluindo...
            </div>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
