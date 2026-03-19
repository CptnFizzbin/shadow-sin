import type { AvailablityInfo } from "#/lib/system/types/availablityInfo.ts"

export type GearItemRestriction = "none" | "restricted" | "forbidden"

export interface GearItemFormState {
  id: string
  name: string
  cost: number
  description: string
  availabilityRating: number
  availabilityRestriction: GearItemRestriction
  sourceBook: string
  sourcePage: number
  items: GearItemFormState[]
}

export function getGearItemAvailability(
  state: GearItemFormState,
): AvailablityInfo | undefined {
  if (state.availabilityRating === 0) return undefined
  return {
    rating: state.availabilityRating,
    restricted: state.availabilityRestriction === "restricted",
    forbidden: state.availabilityRestriction === "forbidden",
  }
}

export function getGearItemTotalCost(item: GearItemFormState): number {
  return (
    item.cost +
    item.items.reduce((sum, subItem) => sum + getGearItemTotalCost(subItem), 0)
  )
}
