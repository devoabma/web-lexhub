import { API } from '@/lib/axios'

interface CreateServiceProps {
  oab: string
  name: string
  email: string
  serviceTypeId: string[]
  assistance: string
  observation?: string
}

export async function createServiceExternal({
  oab,
  name,
  email,
  serviceTypeId,
  assistance,
  observation,
}: CreateServiceProps) {
  await API.post('/services/external', {
    oab,
    name,
    email,
    serviceTypeId,
    assistance,
    observation,
  })
}
