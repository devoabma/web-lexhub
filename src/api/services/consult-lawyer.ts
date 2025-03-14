import { API } from '@/lib/axios'

interface ConsultLawyerProps {
  oab: string
}

export async function consultLawyer({ oab }: ConsultLawyerProps) {
  await API.post('/services/consult/lawyer', {
    oab,
  })
}
