import { API } from '@/lib/axios'

interface ActiveAgentProps {
  id: string
}

export async function activeAgent({ id }: ActiveAgentProps) {
  await API.patch<ActiveAgentProps>(`/agents/active/${id}`)
}
