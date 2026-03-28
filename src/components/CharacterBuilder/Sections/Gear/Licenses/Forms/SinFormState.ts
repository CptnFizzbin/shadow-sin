import type { AvailablityInfo } from "#/lib/system/availablityInfo.ts"

export interface SinFormState {
  id: string
  name: string
  rating: "real" | number
  cost: number
}

export const getSinAvailability = (
  rating: "real" | number,
): AvailablityInfo => {
  if (rating === "real") return { rating: 0 }

  return {
    rating: rating * 3,
    forbidden: true,
  }
}

export const getSinCost = (rating: "real" | number): number => {
  if (rating === "real") return 0
  return rating * 1_000
}
