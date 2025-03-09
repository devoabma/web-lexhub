'use client'

import { getProfile } from '@/api/agents/get-profile'
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
import { Skeleton } from '@/components/ui/skeleton'
import { useMutation, useQuery } from '@tanstack/react-query'
import { LoaderCircle, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function Profile() {
  const router = useRouter()

  // FIXME: Query para pegar o perfil do usuário logado
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
    staleTime: Number.POSITIVE_INFINITY,
  })

  // FIXME: Mutation para se deslogar
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

  function getRoleLabel(role: 'ADMIN' | 'MEMBER' | undefined) {
    if (role === 'ADMIN') return 'Cargo: Administrador'
    if (role === 'MEMBER') return 'Cargo: Membro'
  }

  return (
    <div className="flex items-center max-w-[280px] overflow-hidden">
      <div className="flex flex-col space-y-1 overflow-hidden">
        <span className="font-medium truncate text-ellipsis whitespace-nowrap">
          {isProfileLoading ? (
            <Skeleton className="h-4 w-40" />
          ) : (
            profile?.agent.name
          )}
        </span>
        <span className="text-xs font-medium">
          {isProfileLoading ? (
            <Skeleton className="h-3 w-32" />
          ) : (
            getRoleLabel(profile?.agent.role)
          )}
        </span>
        <span className="text-xs text-muted-foreground truncate text-ellipsis whitespace-nowrap">
          {isProfileLoading ? (
            <Skeleton className="h-3 w-34" />
          ) : (
            profile?.agent.email
          )}
        </span>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          {isProfileLoading ? (
            <Skeleton className="size-8 rounded" />
          ) : (
            <Button
              type="button"
              variant="outline"
              className="ml-auto rounded cursor-pointer flex-shrink-0"
              title="Sair"
            >
              <LogOut className="size-4 text-red-500" />
            </Button>
          )}
        </DialogTrigger>

        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Você realmente quer sair?</DialogTitle>
            <DialogDescription>
              Ao fazer logout, você será desconectado da sua conta.
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
