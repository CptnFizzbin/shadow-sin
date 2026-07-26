import { isItemLicensed } from "#/components/items/types/licenses/licenseUtils.ts"
import { ArrayUtils } from "#/lib/arrayUtils.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import { isLicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import { isSinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"
import { isAvailable } from "#/system/items/itemUtils.ts"

import type { VerificationLane } from "./licenseCheckTypes.ts"

const isRestricted = (item: ItemData) => item.availability?.restricted === true && !item.availability?.forbidden
const isForbidden = (item: ItemData) => item.availability?.forbidden === true
const isSinOrLicense = (item: ItemData) => item.itemType === ItemType.sin || item.itemType === ItemType.license

function buildSinLane(
  sin: SinData,
  licenses: LicenseData[],
  allItems: ItemData[],
  eligible: (item: ItemData) => boolean,
): VerificationLane | null {
  const sinLicenses = licenses.filter((license) => license.parentId === sin.id)

  // Forbidden gear must never be offered a roll, even with a stray licenseId pointing at a real
  // Licence — guard structurally here rather than relying on `kind` alone.
  const licensedGear = allItems.filter((item) =>
    eligible(item) && !isForbidden(item) && sinLicenses.some((license) => license.id === item.licenseId))

  // A SIN with no licensed gear submitted for verification has nothing to check — skip its lane.
  if (licensedGear.length === 0) return null

  return {
    key: sin.id,
    title: sin.name,
    // The SIN itself always checks first; its licensed gear checks in a random order.
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

export interface BuildVerificationLanesOptions {
  /**
   * Include stashed items in the lanes/checklist instead of excluding them. Used by the Setup
   * screen's "Show all items" toggle; a real scan (`useLicenseCheckDialog`'s Start Scan) never
   * passes this, since a stashed item must stay excluded from the run entirely.
   */
  includeStashed?: boolean
}

/**
 * Groups a Runner's gear into the SIN / Unlicensed Gear / Forbidden Gear lanes License Check
 * scans, per docs/features/0011-license-check-dialog.md. One lane per SIN carrying licensed gear
 * (unbounded, not a hardcoded count — SINs with no licensed gear are omitted, nothing to check)
 * plus up to two fixed lanes, each omitted when empty. Within a lane, checks other than a SIN's
 * own (always-first) credential run in a random order each time lanes are built, rather than a
 * fixed data-insertion order.
 */
export function buildVerificationLanes(
  gear: Record<string, ItemData>,
  options: BuildVerificationLanesOptions = {},
): VerificationLane[] {
  const { includeStashed = false } = options
  const eligible = (item: ItemData) => includeStashed || isAvailable(item)

  const allItems = Object.values(gear)
  const licenses = allItems.filter(isLicenseData)

  // "one per active (non-stashed) SIN" (Scan mechanics) — filtered the same way as any other gear.
  const sins = allItems.filter(isSinData).filter(eligible)
  const lanes: VerificationLane[] = sins
    .map((sin) => buildSinLane(sin, licenses, allItems, eligible))
    .filter((lane) => lane !== null)

  const unlicensedItems = allItems.filter((item) =>
    eligible(item) && !isSinOrLicense(item) && isRestricted(item) && !isItemLicensed(item, licenses))

  if (unlicensedItems.length > 0) {
    lanes.push({
      key: "unlicensed",
      title: "Unlicensed Gear",
      checks: unlicensedItems.map((item) => ({ itemId: item.id, kind: "unlicensed-gear" })),
    })
  }

  const forbiddenItems = allItems.filter((item) =>
    eligible(item) && !isSinOrLicense(item) && isForbidden(item))

  if (forbiddenItems.length > 0) {
    lanes.push({
      key: "forbidden",
      title: "Forbidden Gear",
      checks: forbiddenItems.map((item) => ({ itemId: item.id, kind: "forbidden-gear" })),
    })
  }

  return lanes
}
