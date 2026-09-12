// Participação (%) de um valor no total do período; 0 quando o total é zero
export function calculateShare(value: number, total: number) {
  return total > 0 ? (value / total) * 100 : 0
}
