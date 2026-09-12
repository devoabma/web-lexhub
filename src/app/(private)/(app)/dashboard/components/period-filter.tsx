'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  type DashboardPeriod,
  MONTH_NAMES,
  useDashboardPeriod,
} from './use-dashboard-period'
import { useYearOptions } from './use-year-options'

export function PeriodFilter() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const { year, month } = useDashboardPeriod()
  const yearOptions = useYearOptions(year)

  function handlePeriodChange(period: DashboardPeriod) {
    const url = new URLSearchParams(searchParams.toString())

    url.set('year', period.year.toString())

    if (period.month) url.set('month', period.month.toString())
    else url.delete('month')

    // Atualiza a URL sem recarregar a página nem voltar ao topo
    router.push(`?${url.toString()}`, { scroll: false })
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:flex">
      <Select
        value={year.toString()}
        onValueChange={value =>
          handlePeriodChange({ year: Number(value), month })
        }
      >
        <SelectTrigger className="w-full sm:w-28" aria-label="Ano">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {yearOptions.map(option => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={month ? month.toString() : 'ALL'}
        onValueChange={value =>
          handlePeriodChange({
            year,
            month: value === 'ALL' ? undefined : Number(value),
          })
        }
      >
        <SelectTrigger className="w-full sm:w-40" aria-label="Mês">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="ALL">Ano inteiro</SelectItem>
          {MONTH_NAMES.map((name, index) => (
            <SelectItem key={name} value={(index + 1).toString()}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
