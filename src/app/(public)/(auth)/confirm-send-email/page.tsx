import { Card } from '@/components/ui/card'
import type { Metadata } from 'next'
import { MessageEmailSend } from './components/message-email-send'

export const metadata: Metadata = {
  title: 'E-mail enviado | OAB Atende',
}

interface ConfirmSendEmailProps {
  searchParams: Promise<{ email: string }>
}

export default async function ConfirmSendEmail({
  searchParams,
}: ConfirmSendEmailProps) {
  const { email } = await searchParams

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <MessageEmailSend email={email} />
    </Card>
  )
}
