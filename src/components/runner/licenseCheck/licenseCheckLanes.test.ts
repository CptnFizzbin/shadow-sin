import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { SinData } from "#/system/gear/sinData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { buildVerificationLanes } from "./licenseCheckLanes.ts"

const sinId = "00000000-0000-0000-0000-000000000001" as UUID
const licenseId = "00000000-0000-0000-0000-000000000002" as UUID
const itemId = "00000000-0000-0000-0000-000000000003" as UUID
const itemId2 = "00000000-0000-0000-0000-000000000004" as UUID

function gearMap(...items: ItemData[]): Record<string, ItemData> {
  return Object.fromEntries(items.map((item) => [item.id, item]))
}

describe("buildVerificationLanes", () => {
  it("returns an empty array for no gear", () => {
    expect(buildVerificationLanes({})).toEqual([])
  })

  it("builds a SIN lane with the SIN itself and its licensed gear nested underneath", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }
    const weapon: ItemData = { id: itemId, name: "Ares Predator", itemType: ItemType.weapon, licenseId }

    const lanes = buildVerificationLanes(gearMap(sin, license, weapon))

    expect(lanes).toEqual([
      {
        key: sinId,
        title: "John Smith",
        checks: [
          { itemId: sinId, kind: "sin", credentialRating: 3 },
          { itemId, kind: "licensed-gear", credentialRating: 3 },
        ],
      },
    ])
  })

  it("routes a Restricted item with a missing or dangling licenseId to the Unlicensed lane", () => {
    const missing: ItemData = { id: itemId, name: "No License", itemType: ItemType.weapon, availability: { rating: 4, restricted: true } }
    const dangling: ItemData = { id: itemId2, name: "Dangling", itemType: ItemType.weapon, availability: { rating: 4, restricted: true }, licenseId: "00000000-0000-0000-0000-000000000099" as UUID }

    const lanes = buildVerificationLanes(gearMap(missing, dangling))

    // Checks within a lane run in a random order, so assert membership rather than exact order.
    expect(lanes).toHaveLength(1)
    expect(lanes[0].key).toBe("unlicensed")
    expect(lanes[0].title).toBe("Unlicensed Gear")
    expect(lanes[0].checks).toHaveLength(2)
    expect(lanes[0].checks).toEqual(expect.arrayContaining([
      { itemId, kind: "unlicensed-gear" },
      { itemId: itemId2, kind: "unlicensed-gear" },
    ]))
  })

  it("never routes a Forbidden item into the Unlicensed or a SIN lane, even with a stray licenseId", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }
    const forbidden: ItemData = {
      id: itemId,
      name: "Forbidden Gun",
      itemType: ItemType.weapon,
      availability: { rating: 12, forbidden: true },
      licenseId,
    }

    const lanes = buildVerificationLanes(gearMap(sin, license, forbidden))

    // The forbidden item is structurally excluded from the SIN's licensed gear, but the SIN
    // itself still gets a lane — it's independently selectable regardless of its gear.
    expect(lanes).toEqual([
      {
        key: sinId,
        title: "John Smith",
        checks: [{ itemId: sinId, kind: "sin", credentialRating: 3 }],
      },
      {
        key: "forbidden",
        title: "Forbidden Gear",
        checks: [{ itemId, kind: "forbidden-gear" }],
      },
    ])
  })

  it("never lists unrestricted gear in any lane", () => {
    const mundane: ItemData = { id: itemId, name: "Backpack", itemType: ItemType.other, availability: { rating: 0 } }

    expect(buildVerificationLanes(gearMap(mundane))).toEqual([])
  })

  it("still lists a SIN with no licensed gear submitted for verification — it's independently selectable", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }

    expect(buildVerificationLanes(gearMap(sin))).toEqual([
      {
        key: sinId,
        title: "John Smith",
        checks: [{ itemId: sinId, kind: "sin", credentialRating: 3 }],
      },
    ])
  })

  it("still lists a SIN whose Licence has no gear pointing at it", () => {
    const sin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }

    expect(buildVerificationLanes(gearMap(sin, license))).toEqual([
      {
        key: sinId,
        title: "John Smith",
        checks: [{ itemId: sinId, kind: "sin", credentialRating: 3 }],
      },
    ])
  })

  it("lists every owned SIN as its own lane, with or without licensed gear", () => {
    const checkedSin: SinData = { id: sinId, name: "John Smith", itemType: ItemType.sin, rating: 3 }
    const license: LicenseData = { id: licenseId, name: "License", itemType: ItemType.license, rating: 3, parentId: sinId }
    const weapon: ItemData = { id: itemId, name: "Ares Predator", itemType: ItemType.weapon, licenseId }

    const emptySinId = "00000000-0000-0000-0000-000000000005" as UUID
    const emptySin: SinData = { id: emptySinId, name: "Jane Doe", itemType: ItemType.sin, rating: 2 }

    const lanes = buildVerificationLanes(gearMap(checkedSin, license, weapon, emptySin))

    expect(lanes).toEqual([
      {
        key: sinId,
        title: "John Smith",
        checks: [
          { itemId: sinId, kind: "sin", credentialRating: 3 },
          { itemId, kind: "licensed-gear", credentialRating: 3 },
        ],
      },
      {
        key: emptySinId,
        title: "Jane Doe",
        checks: [{ itemId: emptySinId, kind: "sin", credentialRating: 2 }],
      },
    ])
  })
})
