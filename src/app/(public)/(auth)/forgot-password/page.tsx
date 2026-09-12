import type { Metadata } from 'next'
import { PasswordRecoveryForm } from './components/password-recovery-form'

export const metadata: Metadata = {
  title: 'Resetar Senha | OAB Atende',
}

export default function ForgotPasswordPage() {
  return <PasswordRecoveryForm />
}
