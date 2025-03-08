import { API } from '@/lib/axios'

interface CreateAgentProps {
  name: string
  email: string
  password: string
}

export async function createAgent({ name, email, password }: CreateAgentProps) {
  await API.post('/agents', {
    name,
    email,
    password,
  })
}
