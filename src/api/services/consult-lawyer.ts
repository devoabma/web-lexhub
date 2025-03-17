import { API } from '@/lib/axios'

interface ConsultLawyerProps {
  oab: string
}

export async function consultLawyer({ oab }: ConsultLawyerProps) {
  const response = await API.post('/services/consult/lawyer', {
    oab,
  })

  return response.data
}
