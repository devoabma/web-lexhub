'use client'

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
  DialogTrigger,
} from '@/components/ui/dialog'
import { useMutation } from '@tanstack/react-query'
import { LoaderCircle, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function Profile() {
  const router = useRouter()

  const { mutateAsync: logoutFn, isPending: isLoggingOut } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // replace => força o administrador a não voltar para o página anterior
      router.replace('/?logout=true')
    },
  })

  async function handleLogout() {
    try {
      await logoutFn()

      toast.success('Sessão encerrada com sucesso!', {
        description: 'Volte para plataforma quando quiser.',
      })
    } catch (err) {
      toast.error('Houve um erro ao se deslogar!', {
        description: 'Por favor, tente novamente.',
      })
    }
  }

  return (
    <div className="flex items-center gap-3">
      {/* truncate => adicionar o ... se o texto estourar o tamanho da div. */}
      <div className="flex flex-col truncate">
        <span className="truncate font-medium">Hilquias Ferreira Melo</span>
        <span className="truncate text-xs text-muted-foreground">
          hilquiasfmelo@hotmail.com
        </span>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="ml-auto rounded cursor-pointer"
            title="Sair"
          >
            <LogOut className="size-5 text-muted-foreground" />
          </Button>
        </DialogTrigger>

        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Você realmente quer sair?</DialogTitle>
            <DialogDescription>
              Ao fazer logout, você será desconectado da sua conta. Tem certeza
              de que deseja continuar?
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
              disabled={isLoggingOut}
              onClick={handleLogout}
            >
              {!isLoggingOut ? (
                <>
                  <LogOut className="size-4" />
                  Sair da Conta
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <LoaderCircle className="size-4 animate-spin" />
                  Saindo...
                </div>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
