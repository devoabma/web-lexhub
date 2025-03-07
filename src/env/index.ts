import { z } from 'zod'

export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
})

// Validação apenas no servidor (backend)
let env: { NEXT_PUBLIC_API_URL: string }

if (typeof window === 'undefined') {
  env = envSchema.parse(process.env) // Validação no servidor
} else {
  // No frontend, você pode acessar diretamente sem a validação do Zod
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  if (!API_URL) {
    console.error('API URL não está definida no frontend.')
  }

  env = { NEXT_PUBLIC_API_URL: API_URL || '' } // Fallback para evitar erro no frontend
}

export { env }
