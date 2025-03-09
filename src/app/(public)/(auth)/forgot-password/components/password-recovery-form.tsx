'use client'

import { forgotPassword } from '@/api/agents/forgot-password'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { ArrowLeft, ArrowRight, LoaderCircle, Mail } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const PasswordRecoverySchema = z.object({
  email: z.string().email('Insira um endereço de e-mail válido.'),
})

type PasswordRecoveryType = z.infer<typeof PasswordRecoverySchema>

export function PasswordRecoveryForm() {
  const router = useRouter()

  const form = useForm<PasswordRecoveryType>({
    resolver: zodResolver(PasswordRecoverySchema),
    defaultValues: {
      email: '',
    },
  })

  // FIXME: Mutation para enviar e-mail para redefinir
  const { mutateAsync: forgotPasswordFn, isPending: isRecovering } =
    useMutation({
      mutationFn: forgotPassword,
    })

  async function handlePasswordRecovery(data: PasswordRecoveryType) {
    try {
      await forgotPasswordFn({
        email: data.email,
      })

      router.replace(
        `/confirm-send-email/?email=${encodeURIComponent(data.email)}`
      )
    } catch (err) {
      // FIXME: Tratar erros vindo da API
      form.reset()

      toast.error('Não foi possível redefinir a senha. ', {
        description: 'Por favor, tente novamente mais tarde.',
      })

      console.log(err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl">
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
        <Form {...form}>
          <form
            className="space-y-4"
            onSubmit={form.handleSubmit(handlePasswordRecovery)}
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field, formState: { errors } }) => (
                  <FormItem>
                    <FormLabel>Seu e-mail cadastrado</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail
                          className={`absolute left-3 transition-transform duration-200 ${
                            errors.email ? 'top-4.5' : 'top-1/2'
                          } -translate-y-1/2 text-muted-foreground h-4 w-4`}
                        />

                        <Input
                          {...field}
                          placeholder="jhon.doe@example.com"
                          className="rounded pl-10"
                        />
                      </div>
                    </FormControl>

                    {errors.email && (
                      <FormMessage className="text-red-500 text-xs">
                        {errors.email.message}
                      </FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isRecovering}
              className="w-full select-none group bg-sky-700 hover:bg-sky-600 hover:cursor-pointer rounded text-white font-semibold transition-colors"
            >
              {isRecovering ? (
                <>
                  Enviando solicitação{' '}
                  <LoaderCircle className="size-4 animate-spin" />
                </>
              ) : (
                <>
                  Redefinir senha
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>

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
        </Form>
      </CardContent>
    </Card>
  )
}
