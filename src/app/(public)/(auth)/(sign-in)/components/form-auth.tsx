'use client'

import { singIn } from '@/api/agents/sign-in'
import { MessageFieldError } from '@/components/app/message-field-error'
import { PasswordInput } from '@/components/app/password-input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { Loader, LogIn } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const LoginFormSchema = z.object({
  email: z.string().email('Insira um endereço de e-mail válido.'),
  password: z.string().min(8, 'A senha precisa ter pelo menos 8 caracteres.'),
})

type LoginFormType = z.infer<typeof LoginFormSchema>

export function FormAuth() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  })

  // FIXME: Mutation que realiza o login do usuário
  const { mutateAsync: authenticate } = useMutation({
    mutationFn: singIn,
  })

  async function handleLogin(data: LoginFormType) {
    try {
      await authenticate({
        email: data.email,
        password: data.password,
      })

      toast.success('Acesso concedido.', {
        description: 'Bem-vindo(a) à OAB Atende.',
      })

      reset()

      router.push('/dashboard')
    } catch (err) {
      // FIXME: Tratar erros vindo da API
      reset()

      if (isAxiosError(err)) {
        toast.error('Acesso negado!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Acesso negado!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  return (
    <Card className="border-0 w-full max-md:w-[27rem] lg:w-[28rem] shadow-xl backdrop-blur-sm">
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Seu e-mail cadastrado</Label>
              <Input
                id="email"
                data-error={Boolean(errors.email)}
                className="data-[error=true]:border-red-600 rounded data-[error=true]:focus-visible:ring-0"
                type="email"
                {...register('email')}
              />
              {errors.email && (
                <MessageFieldError>{errors.email.message}</MessageFieldError>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">
                  Sua senha
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <PasswordInput
                id="password"
                data-error={Boolean(errors.password)}
                className="data-[error=true]:border-red-600 rounded data-[error=true]:focus-visible:ring-0"
                {...register('password')}
              />
              {errors.password && (
                <MessageFieldError>{errors.password.message}</MessageFieldError>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              isSubmitting || Boolean(errors.email) || Boolean(errors.password)
            }
            className="w-full select-none bg-sky-700 hover:bg-sky-600 hover:cursor-pointer rounded text-white font-semibold transition-colors"
          >
            {isSubmitting ? (
              <>
                Validando credenciais <Loader className="size-5 animate-spin" />
              </>
            ) : (
              <>
                Entrar no sistema <LogIn className="size-5" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 border-t pt-4 pb-6 bg-muted/20">
        <div className="text-center text-xs text-muted-foreground">
          <p className="font-medium">
            Acesso restrito somente a funcionários cadastrados
          </p>
          <p className="mt-1">
            Utilize suas credenciais fornecidas enviada por e-mail
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
