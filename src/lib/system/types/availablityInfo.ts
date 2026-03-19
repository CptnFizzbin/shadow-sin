export interface AvailablityInfo {
  rating: number
  restricted?: boolean
  forbidden?: boolean
}

export function availabilityToString({
  rating,
  restricted,
  forbidden,
}: AvailablityInfo): string {
  if (rating === 0) return "-"
  if (forbidden) return `${rating}F`
  if (restricted) return `${rating}R`
  return String(rating)
}
