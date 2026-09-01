import type { AvailabilityInfo } from "#/system/availabilityInfo.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

/** `rating` is ignored (and may be a placeholder) when `isReal` is `true` — a Real Licence is always free and unrestricted. */
export const getLicenseAvailability = (
  isReal: boolean,
  rating: number,
): AvailabilityInfo => {
  if (isReal) return { rating: 0 }

  return {
    rating: rating * 3,
    forbidden: true,
  }
}

export const getLicenseCost = (isReal: boolean, rating: number): number => {
  if (isReal) return 0
  return rating * 100
}

/** Default rating for a newly-created Fake Licence. */
export const DefaultFakeLicenseRating = 3

/**
 * A gear item can be Licence quick-bought when it is Restricted (not Forbidden — Forbidden
 * items have no legal licence path) and isn't a SIN or Licence itself.
 */
export const isLicenseQuickBuyEligible = (item: ItemData): boolean => {
  if (item.itemType === ItemType.license || item.itemType === ItemType.sin) return false
  return item.availability?.restricted === true && !item.availability?.forbidden
}

/**
 * True when `item.licenseId` points at a Licence that still exists in gear. A dangling
 * reference (its Licence was since removed) is treated the same as unlicensed.
 */
export const isItemLicensed = (item: ItemData, licenses: LicenseData[]): boolean => {
  return item.licenseId !== undefined && licenses.some((license) => license.id === item.licenseId)
}

/**
 * Other gear items eligible to share the same Licence as `item` — same name and item type,
 * not already licensed, excluding `item` itself. Licences generally cover a gear type rather
 * than a single serial number, so multiple identical items (e.g. three Ares Predators) can
 * share one Licence.
 */
export const findLicenseableSiblings = (
  item: ItemData,
  allGear: ItemData[],
  licenses: LicenseData[],
): ItemData[] => {
  return allGear.filter((candidate) =>
    candidate.id !== item.id
    && candidate.name === item.name
    && candidate.itemType === item.itemType
    && !isItemLicensed(candidate, licenses))
}
