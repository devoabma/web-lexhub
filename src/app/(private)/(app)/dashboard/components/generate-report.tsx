'use client'

import { downloadServicesReport } from '@/api/dashboard/download-services-report'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { downloadFile } from '@/utils/download-file'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { FileDown, LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import {
  type DashboardPeriod,
  MONTH_NAMES,
  useDashboardPeriod,
} from './use-dashboard-period'
import { useYearOptions } from './use-year-options'

const reportFormSchema = z.object({
  year: z.string().min(1, 'Selecione o ano.'),
  month: z.string(), // 'ALL' = ano inteiro
})

type ReportFormType = z.infer<typeof reportFormSchema>

function toFormValues({ year, month }: DashboardPeriod): ReportFormType {
  return { year: year.toString(), month: month ? month.toString() : 'ALL' }
}

// Com responseType 'blob', o corpo do erro também chega como Blob
async function getReportErrorMessage(err: unknown) {
  if (isAxiosError(err) && err.response?.data instanceof Blob) {
    try {
      const { message } = JSON.parse(await err.response.data.text())

      if (typeof message === 'string' && message) return message
    } catch {
      // Corpo vazio ou que não é JSON: usa a mensagem genérica
    }
  }

  return 'Por favor, tente novamente.'
}

export function GenerateReport() {
  const [dialogIsOpen, setDialogIsOpen] = useState(false)

  const period = useDashboardPeriod()
  const yearOptions = useYearOptions(period.year)

  const form = useForm<ReportFormType>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: toFormValues(period),
  })

  const { mutateAsync: downloadServicesReportFn, isPending: isGenerating } =
    useMutation({
      mutationFn: downloadServicesReport,
    })

  function handleOpenChange(open: boolean) {
    // Abre sempre com o período que está no seletor do dashboard
    if (open) form.reset(toFormValues(period))

    setDialogIsOpen(open)
  }

  async function handleGenerateReport({ year, month }: ReportFormType) {
    try {
      const { file, fileName } = await downloadServicesReportFn({
        year: Number(year),
        month: month === 'ALL' ? undefined : Number(month),
      })

      downloadFile(file, fileName)

      setDialogIsOpen(false)

      toast.success('Relatório gerado com sucesso!', {
        description: fileName,
      })
    } catch (err) {
      toast.error('Houve um erro ao gerar o relatório!', {
        description: await getReportErrorMessage(err),
      })
    }
  }

  return (
    <Dialog open={dialogIsOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={isGenerating}>
          {isGenerating ? (
            <>
              <LoaderCircle className="animate-spin" />
              Gerando relatório...
            </>
          ) : (
            <>
              <FileDown />
              Gerar relatório (PDF)
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gerar relatório de atendimentos</DialogTitle>
          <DialogDescription>
            Relatório em PDF para a diretoria. Sem mês, o relatório cobre o ano
            inteiro.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleGenerateReport)}
            className="grid gap-5"
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ano</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {yearOptions.map(option => (
                          <SelectItem key={option} value={option.toString()}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mês</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="ALL">Ano inteiro</SelectItem>
                        {MONTH_NAMES.map((name, index) => (
                          <SelectItem key={name} value={(index + 1).toString()}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>

              <Button type="submit" disabled={isGenerating}>
                {isGenerating ? (
                  <>
                    <LoaderCircle className="animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <FileDown />
                    Gerar PDF
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
