// Baixa um arquivo recebido em memória (ex.: PDF da API como Blob)
export function downloadFile(file: Blob, fileName: string) {
  const url = URL.createObjectURL(file)

  const link = document.createElement('a')
  link.href = url
  link.download = fileName

  document.body.appendChild(link)
  link.click()
  link.remove()

  // Revogar no mesmo tick pode cancelar o download em alguns navegadores
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
