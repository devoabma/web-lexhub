import { getServicesYearly } from '@/api/dashboard/get-services-yearly'
import { useQuery } from '@tanstack/react-query'

// Anos do seletor: do primeiro ano com atendimentos até o atual. Mesma chave
// do gráfico anual, então a série é buscada uma vez só. O ano atual e o
// selecionado entram sempre, para o select ter valor enquanto a série carrega
export function useYearOptions(selectedYear: number) {
  const { data: servicesYearly } = useQuery({
    queryKey: ['metrics', 'services-yearly'],
    queryFn: getServicesYearly,
  })

  const years = new Set(servicesYearly?.years.map(item => item.year))

  years.add(new Date().getFullYear())
  years.add(selectedYear)

  return [...years].sort((a, b) => b - a)
}
