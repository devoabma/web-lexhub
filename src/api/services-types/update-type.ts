import { API } from '@/lib/axios'

interface UpdateServiceTypeProps {
  id: string
  name: string
}

export async function updateServiceType({ id, name }: UpdateServiceTypeProps) {
  await API.put(`/services/types/update/${id}`, {
    name,
  })
}
