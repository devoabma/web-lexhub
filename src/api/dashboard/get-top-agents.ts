import { API } from '@/lib/axios'

interface GetTopAgentsProps {
  year?: number
  month?: number
  limit?: number // 1 a 20 (padrão da API: 3)
}

export interface TopAgent {
  id: string
  name: string
  total: number
}

interface GetTopAgentsResponse {
  servicesInPeriod: number
  agents: TopAgent[] // inclui inativos; ordenados por total (desc) e nome
}

export async function getTopAgents({ year, month, limit }: GetTopAgentsProps) {
  const response = await API.get<GetTopAgentsResponse>('/metrics/agents/top', {
    params: { year, month, limit },
  })

  return response.data
}
