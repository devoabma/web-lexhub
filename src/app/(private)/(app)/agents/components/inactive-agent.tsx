'use client'

import { inactiveAgent } from '@/api/agents/inactive'
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
import { LoaderCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'

interface InactiveAgentProps {
  agents: {
    id: string
  }
  onOpenChange: (open: boolean) => void
}

export function InactiveAgent({ agents, onOpenChange }: InactiveAgentProps) {
  // FIXME: Mutation para se desativar o funcionário
  const queryClient = useQueryClient()
  const { mutateAsync: inactiveAgentFn, isPending: isDesactivating } =
    useMutation({
      mutationFn: inactiveAgent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['agents'] })
      },
    })

  async function handleInactiveAgent() {
    try {
      await inactiveAgentFn({
        id: agents.id,
      })

      onOpenChange(false)

      toast.success('Desativação realizada com sucesso!', {
        description: 'Você pode reativar o acesso quando quiser.',
      })
    } catch (err) {
      toast.error('Erro na desativação!', {
        description: 'Por favor, tente novamente.',
      })
    }
  }

  return (
    <DialogContent className="rounded-2xl">
      <DialogHeader>
        <DialogTitle>Desativar Funcionário</DialogTitle>
        <DialogDescription>
          Isso impedirá o acesso à plataforma. Tem certeza que deseja continuar?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="ghost" className="rounded cursor-pointer">
            Cancelar
          </Button>
        </DialogClose>
        <Button
          variant="destructive"
          className="rounded cursor-pointer"
          disabled={isDesactivating}
          onClick={handleInactiveAgent}
        >
          {!isDesactivating ? (
            <>
              <Lock className="size-4" />
              Revogar Acesso
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LoaderCircle className="size-4 animate-spin" />
              Aplicando mudanças...
            </div>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
