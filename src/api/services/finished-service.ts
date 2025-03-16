import { API } from '@/lib/axios'

interface FinishedServiceProps {
  id: string
}

export async function finishedService({ id }: FinishedServiceProps) {
  await API.patch<FinishedServiceProps>(`/services/finished/${id}`)
}
