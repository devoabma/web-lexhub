import { env } from '@/env'
import axios from 'axios'

export const API = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
})
