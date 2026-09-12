import { useSearchParams } from 'next/navigation'
import { z } from 'zod'

export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

// Mesmas faixas aceitas pela API; fora delas, vale o padrão
const yearSchema = z.coerce.number().int().min(2000).max(2100)
const monthSchema = z.coerce.number().int().min(1).max(12)

export interface DashboardPeriod {
  year: number
  month?: number // sem mês = ano inteiro
}

// Período dos gráficos e rankings, guardado na URL (?year=&month=).
// Padrão: ano atual, sem mês
export function useDashboardPeriod(): DashboardPeriod {
  const searchParams = useSearchParams()

  const year = yearSchema.safeParse(searchParams.get('year'))
  const month = monthSchema.safeParse(searchParams.get('month'))

  return {
    year: year.success ? year.data : new Date().getFullYear(),
    month: month.success ? month.data : undefined,
  }
}

export function formatPeriod({ year, month }: DashboardPeriod) {
  return month ? `${MONTH_NAMES[month - 1]} de ${year}` : `Ano de ${year}`
}
