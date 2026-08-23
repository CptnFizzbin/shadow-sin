import { isItemLicensed } from "#/components/items/types/licenses/licenseUtils.ts"
import { ArrayUtils } from "#/lib/arrayUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { isLicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import type { VerificationLane } from "./licenseCheckTypes.ts"

const isRestricted = (item: ItemData) => item.availability?.restricted === true && !item.availability?.forbidden
const isForbidden = (item: ItemData) => item.availability?.forbidden === true
const isSinOrLicense = (item: ItemData) => item.itemType === ItemType.sin || item.itemType === ItemType.license

function buildSinLane(
  sin: SinData,
  licenses: LicenseData[],
  allItems: ItemData[],
): VerificationLane {
  const sinLicenses = licenses.filter((license) => license.items.parentId === sin.id)

  // Forbidden gear must never be offered a roll, even with a stray licenseId pointing at a real
  // Licence — guard structurally here rather than relying on `kind` alone.
  const licensedGear = allItems.filter((item) =>
    !item.stashed && !isForbidden(item) && sinLicenses.some((license) => license.id === item.licenseId))

  return {
    key: sin.id,
    title: sin.name,
    // checks[0] must stay the SIN's own check — callers (e.g. the Setup view's lane grouping)
    // key off it being first to identify SIN lanes; the rest run in random order.
    checks: [
      { itemId: sin.id, kind: "sin", credentialRating: sin.rating },
      ...ArrayUtils.shuffle(licensedGear).map((item) => ({
        itemId: item.id,
        kind: "licensed-gear" as const,
        credentialRating: sinLicenses.find((license) => license.id === item.licenseId)?.rating,
      })),
    ],
  }
}

/**
 * Groups a Runner's gear into the SIN / Unlicensed Gear / Forbidden Gear lanes for the Setup
 * checklist, per docs/features/0011-license-check-dialog.md. One lane per owned SIN (unbounded,
 * not a hardcoded count — a SIN is a held identity with no carry state of its own, so it's always
 * eligible even with no licensed gear submitted underneath it) plus up to two fixed lanes, each
 * omitted when empty. Within a lane, checks other than a SIN's own (always-first) credential run
 * in a random order each time lanes are built, rather than a fixed data-insertion order.
 */
export function buildVerificationLanes(gear: Record<string, ItemData>): VerificationLane[] {
  const allItems = Object.values(gear)
  const licenses = allItems.filter(isLicenseData)

  const sins = allItems.filter(isSinData).filter((item) => !item.stashed)
  const lanes: VerificationLane[] = sins.map((sin) => buildSinLane(sin, licenses, allItems))

  const unlicensedItems = allItems.filter((item) =>
    !item.stashed && !isSinOrLicense(item) && isRestricted(item) && !isItemLicensed(item, licenses))

  if (unlicensedItems.length > 0) {
    lanes.push({
      key: "unlicensed",
      title: "Unlicensed Gear",
      checks: unlicensedItems.map((item) => ({ itemId: item.id, kind: "unlicensed-gear" })),
    })
  }

  const forbiddenItems = allItems.filter((item) =>
    !item.stashed && !isSinOrLicense(item) && isForbidden(item))

  if (forbiddenItems.length > 0) {
    lanes.push({
      key: "forbidden",
      title: "Forbidden Gear",
      checks: forbiddenItems.map((item) => ({ itemId: item.id, kind: "forbidden-gear" })),
    })
  }

  return lanes
}
