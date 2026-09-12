'use client'

import { cancelService } from '@/api/services/cancel-service'
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
import { CircleX, LoaderCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CancelServiceProps {
  services: {
    id: string
  }
  onOpenChange: (open: boolean) => void
}

export function CancelService({ services, onOpenChange }: CancelServiceProps) {
  // FIXME: Mutation para se cancelar atendimento
  const queryClient = useQueryClient()
  const { mutateAsync: cancelServiceFn, isPending: isCancelling } = useMutation(
    {
      mutationFn: cancelService,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['services'] })
      },
    }
  )

  async function handleCancelService() {
    try {
      await cancelServiceFn({
        id: services.id,
      })

      onOpenChange(false)

      toast.warning('Atendimento cancelado com sucesso!', {
        description: 'Essa ação é irreversível.',
      })
    } catch (err) {
      toast.error('Erro ao cancelar atendimento', {
        description:
          'Não foi possível cancelar o atendimento. Tente novamente.',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Cancelar Atendimento</DialogTitle>
        <DialogDescription>
          O atendimento será cancelado. Essa ação é irreversível. Deseja
          continuar?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Voltar</Button>
        </DialogClose>

        <Button
          variant="destructive"
          disabled={isCancelling}
          onClick={handleCancelService}
        >
          {!isCancelling ? (
            <>
              <CircleX />
              Cancelar
            </>
          ) : (
            <>
              <LoaderCircle className="animate-spin" />
              Cancelando...
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
