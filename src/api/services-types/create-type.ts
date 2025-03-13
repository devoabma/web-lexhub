import { API } from '@/lib/axios'

interface CreateServiceTypeProps {
  name: string
}

export async function createServiceType({ name }: CreateServiceTypeProps) {
  await API.post('/services/types', {
    name,
  })
}
