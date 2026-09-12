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
import { CircleCheck, LoaderCircle } from 'lucide-react'
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
          'Não foi possível concluir o atendimento. Tente novamente.',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Concluir Atendimento</DialogTitle>
        <DialogDescription>
          O atendimento será concluído. Deseja continuar?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Voltar</Button>
        </DialogClose>

        <Button disabled={isFinishing} onClick={handleFinishedService}>
          {!isFinishing ? (
            <>
              <CircleCheck />
              Concluir
            </>
          ) : (
            <>
              <LoaderCircle className="animate-spin" />
              Concluindo...
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
