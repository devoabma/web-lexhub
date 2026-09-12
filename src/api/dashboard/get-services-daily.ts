import { API } from '@/lib/axios'

interface GetServicesDailyProps {
  year?: number
  month?: number
}

export interface ServicesPerDay {
  day: number
  date: string // 'YYYY-MM-DD'
  total: number
}

interface GetServicesDailyResponse {
  year: number
  month: number
  total: number
  days: ServicesPerDay[] // 28 a 31 itens
}

export async function getServicesDaily({ year, month }: GetServicesDailyProps) {
  const response = await API.get<GetServicesDailyResponse>(
    '/metrics/services/daily',
    { params: { year, month } }
  )

  return response.data
}
