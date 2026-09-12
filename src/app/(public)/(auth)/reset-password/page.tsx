import { ResetPasswordForm } from './components/reset-password-form'

interface ResetPasswordPageProps {
  searchParams: Promise<{ code?: string }>
}

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { code } = await searchParams

  return <ResetPasswordForm code={code} />
}
