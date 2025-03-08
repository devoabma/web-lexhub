import { API } from '@/lib/axios'

interface UpdateAgentProps {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEMBER'
}

export async function updateAgent({ id, name, email, role }: UpdateAgentProps) {
  await API.put(`/agents/update/${id}`, {
    name,
    email,
    role,
  })
}
