import { API } from '@/lib/axios'

interface CancelServiceProps {
  id: string
}

export async function cancelService({ id }: CancelServiceProps) {
  await API.delete<CancelServiceProps>(`/services/cancel/${id}`)
}
