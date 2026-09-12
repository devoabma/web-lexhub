import { API } from '@/lib/axios'

interface GetServicesMonthlyProps {
  year?: number
}

export interface ServicesPerMonth {
  month: number
  label: string // 'Jan'..'Dez'
  total: number
}

interface GetServicesMonthlyResponse {
  year: number
  total: number
  months: ServicesPerMonth[] // sempre 12
}

export async function getServicesMonthly({ year }: GetServicesMonthlyProps) {
  const response = await API.get<GetServicesMonthlyResponse>(
    '/metrics/services/monthly',
    { params: { year } }
  )

  return response.data
}
