import { env } from '@/env'
import axios from 'axios'

export const API = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})

if (process.env.NODE_ENV === 'development') {
  API.interceptors.request.use(async config => {
    await new Promise(resolve => setTimeout(resolve, 2000))

    return config
  })
}
