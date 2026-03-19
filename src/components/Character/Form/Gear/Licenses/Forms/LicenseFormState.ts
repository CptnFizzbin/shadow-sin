import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"

export interface LicenseFormState {
  id: string
  sinId: string
  name: string
  rating: "real" | `${number}`
  cost: number
}

export const getLicenseAvailability = (
  rating: "real" | `${number}`,
): AvailablityInfo => {
  if (rating === "real") return { rating: 0 }

  return {
    rating: Number(rating) * 3,
    forbidden: true,
  }
}

export const getLicenseCost = (rating: "real" | `${number}`): number => {
  if (rating === "real") return 0
  return Number(rating) * 100
}
