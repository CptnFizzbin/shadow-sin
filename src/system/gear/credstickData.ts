import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

export enum CredstickType {
  standard = "standard",
  silver = "silver",
  gold = "gold",
  platinum = "platinum",
  ebony = "ebony",
}

export const CredstickMaxBalance: Record<CredstickType, number> = {
  [CredstickType.standard]: 5_000,
  [CredstickType.silver]: 20_000,
  [CredstickType.gold]: 100_000,
  [CredstickType.platinum]: 500_000,
  [CredstickType.ebony]: 1_000_000,
}

export const CredstickTypeLabel: Record<CredstickType, string> = {
  [CredstickType.standard]: "Standard",
  [CredstickType.silver]: "Silver",
  [CredstickType.gold]: "Gold",
  [CredstickType.platinum]: "Platinum",
  [CredstickType.ebony]: "Ebony",
}

/** Flat nuyen cost to purchase (certify) a credstick regardless of type */
export const CredstickPurchaseCost = 25

export interface CredstickData extends ItemData {
  itemType: ItemType.credstick
  credstickType: CredstickType
  balance: number
}

export function isCredstickData(item: ItemData): item is CredstickData {
  return item.itemType === ItemType.credstick
}
