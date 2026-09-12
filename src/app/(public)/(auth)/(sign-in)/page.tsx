import { FormAuth } from './components/form-auth'

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-bold font-heading text-2xl tracking-tight sm:text-3xl">
          Acessar a Plataforma
        </h1>
        <p className="text-muted-foreground text-sm">
          Registre seus atendimentos de uma forma rápida e fácil
        </p>
      </div>

      <FormAuth />
    </div>
  )
}
