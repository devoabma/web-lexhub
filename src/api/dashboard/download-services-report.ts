import { API } from '@/lib/axios'

interface DownloadServicesReportProps {
  year: number
  month?: number // sem mês = relatório do ano inteiro
}

// Lê o nome do arquivo do Content-Disposition (`filename*=` tem prioridade)
function getFileName(contentDisposition: unknown) {
  if (typeof contentDisposition !== 'string') return null

  const encoded = /filename\*\s*=\s*(?:UTF-8'')?"?([^";]+)"?/i.exec(
    contentDisposition
  )

  if (encoded) {
    try {
      return decodeURIComponent(encoded[1])
    } catch {
      // Valor mal codificado: tenta o `filename=` simples
    }
  }

  const plain = /filename\s*=\s*"?([^";]+)"?/i.exec(contentDisposition)

  return plain?.[1] ?? null
}

export async function downloadServicesReport({
  year,
  month,
}: DownloadServicesReportProps) {
  const response = await API.get<Blob>('/metrics/report', {
    params: { year, month },
    responseType: 'blob',
  })

  // Mesmo formato de nome da API, caso o header não esteja disponível
  const fallbackName = `relatorio-atendimentos-${year}${
    month ? `-${String(month).padStart(2, '0')}` : ''
  }.pdf`

  return {
    file: response.data,
    fileName:
      getFileName(response.headers['content-disposition']) ?? fallbackName,
  }
}
