import { API } from '@/lib/axios'

interface inactiveAgentProps {
  id: string
  inactive: string | null
}

export async function inactiveAgent({ id, inactive }: inactiveAgentProps) {
  await API.patch<inactiveAgentProps>(`/agents/inactive/${id}`, {
    inactive,
  })
}
