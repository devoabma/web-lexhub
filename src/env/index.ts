import { z } from 'zod'

// Defina o esquema de validação com Zod
export const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(), // Valida se é uma URL válida
  NEXT_PUBLIC_DOMAIN: z.string().default('localhost'),
})

let env: { NEXT_PUBLIC_API_URL: string; NEXT_PUBLIC_DOMAIN: string }

// Verifique se estamos no servidor ou no frontend
if (typeof window === 'undefined') {
  // No servidor, valida usando process.env diretamente
  env = envSchema.parse(process.env) // Validação no servidor
} else {
  // No frontend, use a URL atual para pegar o domínio
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const DOMAIN = window.location.hostname || 'localhost'

  if (!API_URL) {
    console.error('API URL não está definida no frontend.')
  }

  env = { NEXT_PUBLIC_DOMAIN: DOMAIN, NEXT_PUBLIC_API_URL: API_URL || '' } // Dinamicamente determina o domínio
}

export { env }
