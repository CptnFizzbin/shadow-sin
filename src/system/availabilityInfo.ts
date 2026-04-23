export interface AvailabilityInfo {
  rating: number
  restricted?: boolean
  forbidden?: boolean
}

export function availabilityToString({
  rating,
  restricted,
  forbidden,
}: AvailabilityInfo): string {
  if (rating === 0) return "-"
  if (forbidden) return `${rating}F`
  if (restricted) return `${rating}R`
  return String(rating)
}
