'use client'

import { Button } from '@/components/ui/button'
import {
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface ConfirmSendEmailProps {
  email: string
}

export function MessageEmailSend({ email }: ConfirmSendEmailProps) {
  const emailFromUrl = decodeURIComponent(email)

  return (
    <>
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
    </>
  )
}
