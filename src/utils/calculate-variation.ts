// Variação percentual entre o período atual e o anterior. Sem registros no
// período anterior, considera 100% de crescimento (ou 0% se ambos forem zero)
export function calculateVariation(current: number, previous: number) {
  if (previous > 0) {
    return ((current - previous) / previous) * 100
  }

  return current > 0 ? 100 : 0
}
