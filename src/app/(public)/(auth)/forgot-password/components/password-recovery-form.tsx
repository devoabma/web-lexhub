'use client'

import { MessageFieldError } from '@/components/app/message-field-error'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CheckCircle, Loader, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const PasswordRecoverySchema = z.object({
  email: z.string().email('Insira um endereço de e-mail válido.'),
})

type PasswordRecoveryType = z.infer<typeof PasswordRecoverySchema>

export function PasswordRecoveryForm() {
  const router = useRouter() // 👈 Instancia o hook useRouter
  const searchParams = useSearchParams()

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isSubmitted, isLoading },
  } = useForm<PasswordRecoveryType>({
    resolver: zodResolver(PasswordRecoverySchema),
  })

  async function handlePasswordRecovery(data: PasswordRecoveryType) {
    try {
      console.log({
        data,
      })

      // Redireciona para a mesma página com o e-mail na URL
      router.push(`?email=${encodeURIComponent(data.email)}`)
    } catch (err) {
      console.log(err)
    }
  }

  // Pega o e-mail da URL
  const emailFromUrl = searchParams.get('email')

  if (isSubmitted || emailFromUrl) {
    return (
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold">E-mail enviado</CardTitle>
          <CardDescription>
            Enviamos instruções de recuperação para{' '}
            <span className="font-bold">{emailFromUrl}</span>
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex items-center justify-center">
          <Button
            variant="link"
            className="text-sm group  text-muted-foreground cursor-pointer"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Voltar para o login
            </Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Recuperação de senha
        </CardTitle>
        <CardDescription className="text-center">
          Digite seu endereço de e-mail cadastrado e enviaremos instruções para
          redefinir sua senha.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(handlePasswordRecovery)}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Seu e-mail cadastrado
            </Label>
            <div className={`relative ${errors.email ? 'mb-6' : 'mb-2'}`}>
              <div className="relative">
                <Mail
                  className={`absolute left-3 transition-transform duration-200 ${
                    errors.email ? 'top-4.5' : 'top-1/2'
                  } -translate-y-1/2 text-muted-foreground h-4 w-4`}
                />
                <Input
                  id="email"
                  data-error={Boolean(errors.email)}
                  placeholder="jhon.doe@example.com"
                  className="data-[error=true]:border-red-600 pl-10 rounded data-[error=true]:focus-visible:ring-0 transition-all duration-200"
                  type="email"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <MessageFieldError>{errors.email.message}</MessageFieldError>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || Boolean(errors.email)}
            className="w-full select-none group bg-sky-700 hover:bg-sky-600 hover:cursor-pointer rounded text-white font-semibold transition-colors"
          >
            {isSubmitting ? (
              <>
                Enviando solicitação <Loader className="size-5 animate-spin" />
              </>
            ) : (
              <>
                Redefinir senha
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex justify-center border-t pt-4">
        <Button
          variant="link"
          className="text-sm group text-muted-foreground cursor-pointer"
          asChild
        >
          <Link href="/">
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Voltar para o login
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
