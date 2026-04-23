import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import type { ItemData } from "#/system/itemData.ts"

export const getSinAvailability = (
  rating: ItemData["rating"],
): AvailabilityInfo => {
  if (typeof rating !== "number") return { rating: 0 }

  return {
    rating: rating * 3,
    forbidden: true,
  }
}

export const getSinCost = (rating: "real" | number): number => {
  if (rating === "real") return 0
  return rating * 1_000
}
