import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { buildVerificationChecks } from "./licenseCheckChecks.ts"

const sinId = "00000000-0000-0000-0000-000000000001" as UUID
const licenseId = "00000000-0000-0000-0000-000000000002" as UUID
const itemId = "00000000-0000-0000-0000-000000000003" as UUID
const itemId2 = "00000000-0000-0000-0000-000000000004" as UUID

function gearMap(...items: ItemData[]): Record<string, ItemData> {
  return Object.fromEntries(items.map((item) => [item.id, item]))
}

describe("buildVerificationChecks", () => {
  it("returns an empty array for no gear", () => {
    expect(buildVerificationChecks({}, [])).toEqual([])
  })

  it("keeps a checked SIN's own credential alongside its checked licensed gear", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }
    const weapon: ItemData = { id: itemId, name: "Ares Predator", itemType: ItemType.weapon, licenseId }
    const gear = gearMap(sin, license, weapon)

    const checks = buildVerificationChecks(gear, [weapon])

    expect(checks).toEqual(expect.arrayContaining([
      { itemId: sinId, kind: "sin", credentialRating: 3 },
      { itemId, kind: "licensed-gear", credentialRating: 3 },
    ]))
    expect(checks).toHaveLength(2)
  })

  it("drops a SIN entirely when none of its licensed gear is checked", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }
    const weapon: ItemData = { id: itemId, name: "Ares Predator", itemType: ItemType.weapon, licenseId }
    const gear = gearMap(sin, license, weapon)

    const checks = buildVerificationChecks(gear, [])

    expect(checks).toEqual([])
  })

  it("keeps only the checked licensed-gear item when a SIN carries more than one", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }
    const checkedWeapon: ItemData = { id: itemId, name: "Ares Predator", itemType: ItemType.weapon, licenseId }
    const uncheckedWeapon: ItemData = { id: itemId2, name: "Defiance EX Shocker", itemType: ItemType.weapon, licenseId }
    const gear = gearMap(sin, license, checkedWeapon, uncheckedWeapon)

    const checks = buildVerificationChecks(gear, [checkedWeapon])

    expect(checks).toEqual(expect.arrayContaining([
      { itemId: sinId, kind: "sin", credentialRating: 3 },
      { itemId, kind: "licensed-gear", credentialRating: 3 },
    ]))
    expect(checks).toHaveLength(2)
  })

  it("drops an unchecked Unlicensed or Forbidden item but keeps a checked one", () => {
    const checkedUnlicensed: ItemData = { id: itemId, name: "No License", itemType: ItemType.weapon, availability: { rating: 4, restricted: true } }
    const uncheckedForbidden: ItemData = { id: itemId2, name: "Forbidden Gun", itemType: ItemType.weapon, availability: { rating: 12, forbidden: true } }
    const gear = gearMap(checkedUnlicensed, uncheckedForbidden)

    const checks = buildVerificationChecks(gear, [checkedUnlicensed])

    expect(checks).toEqual([{ itemId, kind: "unlicensed-gear" }])
  })

  it("shuffles the combined checks rather than preserving lane order", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }
    const weapon: ItemData = { id: itemId, name: "Ares Predator", itemType: ItemType.weapon, licenseId }
    const unlicensed: ItemData = { id: itemId2, name: "No License", itemType: ItemType.weapon, availability: { rating: 4, restricted: true } }
    const gear = gearMap(sin, license, weapon, unlicensed)

    const checks = buildVerificationChecks(gear, [weapon, unlicensed])

    expect(checks).toHaveLength(3)
    expect(checks).toEqual(expect.arrayContaining([
      { itemId: sinId, kind: "sin", credentialRating: 3 },
      { itemId, kind: "licensed-gear", credentialRating: 3 },
      { itemId: itemId2, kind: "unlicensed-gear" },
    ]))
  })
})
