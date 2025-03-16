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
  const minutes = durationMs
    ? Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
    : 0

  const durationText = `${hours}h ${minutes}min`

  return durationText
}
