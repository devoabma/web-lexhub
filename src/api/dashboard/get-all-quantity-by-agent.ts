import { API } from '@/lib/axios'

interface GetAllQuantityByAgentProps {
  id: string | false
}

interface GetAllQuantityByAgentResponse {
  totalGeneral: number
  totalOnMonth: number
  totalOnPreviousMonth: number
}

export async function getAllQuantityByAgent({
  id,
}: GetAllQuantityByAgentProps) {
  const response = await API.get<GetAllQuantityByAgentResponse>(
    `/services/general/agent/${id}`
  )

  return response.data
}
