import { API } from '@/lib/axios'

export async function logout() {
  await API.post('/agents/logout')
}
