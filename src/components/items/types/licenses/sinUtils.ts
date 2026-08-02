import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import { SinNameList } from "#/system/gear/sinNameList.ts"
import type { ItemData } from "#/system/itemData.ts"

/** Picks a random cover name from `SinNameList`, e.g. for the SIN form's "Randomize" button. */
export const getRandomSinName = (): string => {
  const index = Math.floor(Math.random() * SinNameList.length)
  return SinNameList[index]
}

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
