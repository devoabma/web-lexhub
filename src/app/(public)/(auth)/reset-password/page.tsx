import { ResetPasswordForm } from './components/reset-password-form'

interface ResetPasswordPageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { code } = await searchParams

  return (
    <main className="flex items-center justify-center bg-gradient-to-br from-primary-50 to-foreground-50 p-4">
      <ResetPasswordForm code={code} />
    </main>
  )
}
