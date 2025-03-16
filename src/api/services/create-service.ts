import { API } from '@/lib/axios'

interface CreateServiceProps {
  oab: string
  serviceTypeId: string[]
  assistance: string
  observation?: string
}

export async function createService({
  oab,
  serviceTypeId,
  assistance,
  observation,
}: CreateServiceProps) {
  await API.post('/services', {
    oab,
    serviceTypeId,
    assistance,
    observation,
  })
}
