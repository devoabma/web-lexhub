import { FormAuth } from './components/form-auth'

export default function SignInPage() {
  return (
    <main className="">
      <div className="w-[31.25rem] flex flex-col justify-center gap-6">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-3xl font-calsans font-bold tracking-tight">
            Acessar a Plataforma
          </h1>
          <p className="text-sm  text-muted-foreground">
            Registre seus atendimentos de uma forma rápida e fácil
          </p>
        </div>

        <FormAuth />
      </div>
    </main>
  )
}
