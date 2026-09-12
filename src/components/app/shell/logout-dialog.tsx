'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { logout } from '@/api/agents/logout'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutDialog({ open, onOpenChange }: LogoutDialogProps) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutateAsync: logoutFn, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
  })

  async function handleLogout() {
    try {
      await logoutFn()

      toast.success('Sessão encerrada com sucesso!', {
        description: 'Volte para plataforma quando quiser.',
      })
    } catch {
      // A falha não prende o usuário: com a sessão já expirada a API responde
      // 401, e o middleware apaga o cookie inválido ao abrir o login
    }

    // Descarta os dados da sessão (perfil, listagens, métricas) antes de sair
    queryClient.clear()

    // replace => impede voltar para a página anterior
    router.replace('/?logout=true')

    // Depois da navegação (uma navegação descarta um refresh pendente): limpa
    // o cache do roteador do Next, com layouts e prefetches deste usuário
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-xl">
        <DialogHeader>
          <DialogTitle>Você realmente quer sair?</DialogTitle>
          <DialogDescription>
            Ao fazer logout, você será desconectado da sua conta.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={isLoggingOut}
            onClick={handleLogout}
          >
            {isLoggingOut ? (
              <>
                <LoaderCircle className="animate-spin" />
                Saindo...
              </>
            ) : (
              <>
                <LogOut />
                Sair da conta
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
