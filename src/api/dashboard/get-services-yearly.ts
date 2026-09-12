import { API } from '@/lib/axios'

export interface ServicesPerYear {
  year: number
  total: number
}

interface GetServicesYearlyResponse {
  years: ServicesPerYear[]
}

export async function getServicesYearly() {
  const response = await API.get<GetServicesYearlyResponse>(
    '/metrics/services/yearly'
  )

  return response.data
}
