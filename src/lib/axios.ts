import { env } from '@/env'
import axios from 'axios'

export const API = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

// Interceptor com delay de 2 segundos
API.interceptors.request.use(
  async config => {
    await new Promise(resolve => setTimeout(resolve, 2000)) // Espera 2 segundos
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
