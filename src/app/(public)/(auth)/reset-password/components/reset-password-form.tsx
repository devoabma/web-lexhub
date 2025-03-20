'use client'

import { resetPassword } from '@/api/agents/reset-password'
import { PasswordInput } from '@/components/app/password-input'
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
import { isAxiosError } from 'axios'
import { ArrowRight, KeyRound, LoaderCircle, UserRoundPlus } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const resetPasswordFormSchema = z
  .object({
    code: z.string().min(6, {
      message: 'O código possui obrigatoriamente 6 caracteres',
    }),
    password: z.string().min(8, {
      message: 'A senha deve ter pelo menos 8 caracteres',
    }),
    confirmPassword: z.string().min(8, {
      message: 'A confirmação de senha deve ter pelo menos 8 caracteres',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type ResetPasswordFormType = z.infer<typeof resetPasswordFormSchema>

interface ResetPasswordFormProps {
  code?: string
}

export function ResetPasswordForm({ code }: ResetPasswordFormProps) {
  const router = useRouter()

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      code: code || '',
      password: '',
      confirmPassword: '',
    },
  })

  const { mutateAsync: resetPasswordFn, isPending: isResetting } = useMutation({
    mutationFn: resetPassword,
  })

  async function handleResetPassword(data: ResetPasswordFormType) {
    try {
      await resetPasswordFn({
        code: data.code,
        password: data.password,
      })

      toast.success('Senha redefinida com sucesso!', {
        description: 'Agora você pode fazer login na plataforma.',
      })

      router.replace('/?reset-password=true')
    } catch (err) {
      // FIXME: Tratar erros vindo da API
      form.reset()

      if (isAxiosError(err)) {
        toast.error('Houve um erro ao redefinir a senha!', {
          description: err.response?.data.message,
        })

        return
      }

      toast.error('Houve um erro ao redefinir a senha!', {
        description: 'Por favor, tente novamente.',
      })

      console.log(err)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto rounded-2xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Redefinir senha
        </CardTitle>
        <CardDescription className="text-center">
          Digite o código de verificação que enviamos para você e crie uma nova
          senha
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleResetPassword)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Código de verificação</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                      <Input
                        className="pl-10 rounded"
                        placeholder="Digite o código"
                        {...field}
                      />
                    </div>
                  </FormControl>

                  {errors.code && (
                    <FormMessage className="text-red-500 text-xs">
                      {errors.code.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Nova senha</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} className="rounded" />
                  </FormControl>

                  {errors.password && (
                    <FormMessage className="text-red-500 text-xs">
                      {errors.password.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field, formState: { errors } }) => (
                <FormItem>
                  <FormLabel>Confirmar senha</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} className="rounded" />
                  </FormControl>

                  {errors.code && (
                    <FormMessage className="text-red-500 text-xs">
                      {errors.code.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isResetting}
              className="bg-sky-700 w-full group hover:bg-sky-600 text-white cursor-pointer rounded"
            >
              {isResetting ? (
                <>
                  <LoaderCircle className="animate-spin" />
                  Aplicando alterações...
                </>
              ) : (
                <>
                  Redefinir senha
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Lembrou a senha?{' '}
          <Link href="/" className="text-primary hover:underline">
            Voltar ao login
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
