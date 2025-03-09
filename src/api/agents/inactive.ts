import { API } from '@/lib/axios'

interface inactiveAgentProps {
  id: string
}

export async function inactiveAgent({ id }: inactiveAgentProps) {
  await API.patch<inactiveAgentProps>(`/agents/inactive/${id}`)
}
