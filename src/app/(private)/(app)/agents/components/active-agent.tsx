'use client'

import { activeAgent } from '@/api/agents/active'
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
import { LoaderCircle, LockOpen } from 'lucide-react'
import { toast } from 'sonner'

interface InactiveAgentProps {
  agents: {
    id: string
  }
  onOpenChange: (open: boolean) => void
}

export function ActiveAgent({ agents, onOpenChange }: InactiveAgentProps) {
  // FIXME: Mutation para se desativar o funcionário
  const queryClient = useQueryClient()
  const { mutateAsync: activeAgentFn, isPending: isActivating } = useMutation({
    mutationFn: activeAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] })
    },
  })

  async function handleActiveAgent() {
    try {
      await activeAgentFn({
        id: agents.id,
      })

      onOpenChange(false)

      toast.success('Ativação realizada com sucesso!', {
        description: 'Você pode desativar o acesso quando quiser.',
      })
    } catch (err) {
      toast.error('Erro na ativação!', {
        description: 'Por favor, tente novamente.',
      })
    }
  }

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Ativar Funcionário</DialogTitle>
        <DialogDescription>
          Isso dará acesso de volta a plataforma. Tem certeza que deseja
          continuar?
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Voltar</Button>
        </DialogClose>
        <Button disabled={isActivating} onClick={handleActiveAgent}>
          {!isActivating ? (
            <>
              <LockOpen />
              Permitir Acesso
            </>
          ) : (
            <>
              <LoaderCircle className="animate-spin" />
              Aplicando mudanças...
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
