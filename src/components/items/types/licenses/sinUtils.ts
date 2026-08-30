import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import { SinNameList } from "#/system/gear/sinNameList.ts"

/** Picks a random cover name from `SinNameList`, e.g. for the SIN form's "Randomize" button. */
export const getRandomSinName = (): string => {
  const index = Math.floor(Math.random() * SinNameList.length)
  return SinNameList[index]
}

/** `rating` is ignored (and may be a placeholder) when `isReal` is `true` — a Real SIN is always unrestricted. */
export const getSinAvailability = (
  isReal: boolean,
  rating: number,
): AvailabilityInfo => {
  if (isReal) return { rating: 0 }

  return {
    rating: rating * 3,
    forbidden: true,
  }
}

export const getSinCost = (isReal: boolean, rating: number): number => {
  if (isReal) return 0
  return rating * 1_000
}
