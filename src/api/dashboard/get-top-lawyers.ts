import { API } from '@/lib/axios'

interface GetTopLawyersProps {
  year?: number
  month?: number
  limit?: number // 1 a 50 (padrão da API: 10)
}

export interface TopLawyer {
  id: string
  name: string
  oab: string
  total: number
}

interface GetTopLawyersResponse {
  servicesInPeriod: number
  lawyers: TopLawyer[] // ordenados por total (desc) e, no empate, por nome
}

export async function getTopLawyers({
  year,
  month,
  limit,
}: GetTopLawyersProps) {
  const response = await API.get<GetTopLawyersResponse>(
    '/metrics/lawyers/top',
    { params: { year, month, limit } }
  )

  return response.data
}
