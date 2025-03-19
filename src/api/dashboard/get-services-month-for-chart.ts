import { API } from '@/lib/axios'

interface ServiceByMonthProps {
  data: string
  services: number
}

type ServicesByMonthResponse = ServiceByMonthProps[]

export async function getServicesMonthForChart() {
  const response = await API.get<ServicesByMonthResponse>('/services/monthly')

  return response.data
}
