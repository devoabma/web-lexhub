import type { Metadata } from 'next'
import { PasswordRecoveryForm } from './components/password-recovery-form'

export const metadata: Metadata = {
  title: 'Resetar Senha | OAB Atende',
}

export default function ForgotPasswordPage() {
  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-primary-50 to-foreground-50 p-4">
      <PasswordRecoveryForm />
    </main>
  )
}
