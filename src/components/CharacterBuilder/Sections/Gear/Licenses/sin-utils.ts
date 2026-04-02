import type { AvailablityInfo } from "#/lib/system/availablity-info.ts"
import type { ItemData } from "#/lib/system/item-data.ts"

export const getSinAvailability = (
  rating: ItemData["rating"],
): AvailablityInfo => {
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
