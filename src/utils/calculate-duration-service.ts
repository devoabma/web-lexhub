interface Service {
  createdAt: string
  finishedAt?: string | null
}

export function calculateDurationService(services: Service): string {
  const durationMs =
    services.finishedAt &&
    new Date(services.finishedAt).getTime() -
      new Date(services.createdAt).getTime()

  const hours = durationMs ? Math.floor(durationMs / (1000 * 60 * 60)) : 0
  let minutes = durationMs
    ? Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    : 0

  // Se a duração for menor que 1 minuto, considerar 1 minuto
  if (hours === 0 && minutes === 0) {
    minutes = 1
  }

  return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
}
