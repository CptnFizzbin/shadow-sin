import type { UUID } from "node:crypto"

import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { LicenseData } from "#/system/gear/licenseData.ts"
import type { ItemData } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import {
  DefaultFakeLicenseRating,
  findLicenseableSiblings,
  getLicenseCost,
  isItemLicensed,
  isLicenseQuickBuyEligible,
} from "./licenseUtils.ts"

describe("isLicenseQuickBuyEligible", () => {
  const baseItem: ItemData = {
    kind: EntityKind.item,
    id: "00000000-0000-0000-0000-000000000001",
    itemType: ItemType.weapon,
    name: "Ares Predator",
  }

  it("is eligible for a Restricted item", () => {
    // Arrange
    const item: ItemData = { ...baseItem, availability: { rating: 4, restricted: true } }

    // Act / Assert
    expect(isLicenseQuickBuyEligible(item)).toBe(true)
  })

  it("is not eligible for an item with no availability", () => {
    // Arrange / Act / Assert
    expect(isLicenseQuickBuyEligible(baseItem)).toBe(false)
  })

  it("is not eligible for a Forbidden item", () => {
    // Arrange
    const item: ItemData = { ...baseItem, availability: { rating: 12, forbidden: true } }

    // Act / Assert
    expect(isLicenseQuickBuyEligible(item)).toBe(false)
  })

  it("is not eligible for a legal (unrestricted) item", () => {
    // Arrange
    const item: ItemData = { ...baseItem, availability: { rating: 4 } }

    // Act / Assert
    expect(isLicenseQuickBuyEligible(item)).toBe(false)
  })

  it("is not eligible for a SIN or Licence item, even if flagged restricted", () => {
    // Arrange
    const sin: ItemData = { ...baseItem, itemType: ItemType.sin, availability: { rating: 4, restricted: true } }
    const license: ItemData = { ...baseItem, itemType: ItemType.license, availability: { rating: 4, restricted: true } }

    // Act / Assert
    expect(isLicenseQuickBuyEligible(sin)).toBe(false)
    expect(isLicenseQuickBuyEligible(license)).toBe(false)
  })
})

describe("isItemLicensed", () => {
  const licenseId = "00000000-0000-0000-0000-000000000003"

  const item: ItemData = {
    kind: EntityKind.item,
    id: "00000000-0000-0000-0000-000000000002",
    itemType: ItemType.weapon,
    name: "Ares Predator",
    licenseId,
  }

  const license: LicenseData = {
    kind: EntityKind.item,
    id: licenseId,
    itemType: ItemType.license,
    name: "License",
    rating: 4,
  }

  it("is true when the item's licenseId points at an existing licence", () => {
    // Arrange / Act / Assert
    expect(isItemLicensed(item, [license])).toBe(true)
  })

  it("is false when the item has no licenseId", () => {
    // Arrange
    const unlicensed: ItemData = { ...item, licenseId: undefined }

    // Act / Assert
    expect(isItemLicensed(unlicensed, [license])).toBe(false)
  })

  it("is false when licenseId points at a licence that no longer exists", () => {
    // Arrange / Act / Assert
    expect(isItemLicensed(item, [])).toBe(false)
  })
})

describe("findLicenseableSiblings", () => {
  const makePistol = (id: UUID, overrides: Partial<ItemData> = {}): ItemData => ({
    kind: EntityKind.item,
    id,
    itemType: ItemType.weapon,
    name: "Ares Predator",
    ...overrides,
  })

  it("finds other unlicensed items with the same name and item type", () => {
    // Arrange
    const item = makePistol("00000000-0000-0000-0000-000000000001")
    const sibling = makePistol("00000000-0000-0000-0000-000000000002")
    const allGear = [item, sibling]

    // Act
    const siblings = findLicenseableSiblings(item, allGear, [])

    // Assert
    expect(siblings).toEqual([sibling])
  })

  it("excludes the item itself", () => {
    // Arrange
    const item = makePistol("00000000-0000-0000-0000-000000000001")

    // Act
    const siblings = findLicenseableSiblings(item, [item], [])

    // Assert
    expect(siblings).toEqual([])
  })

  it("excludes items that already have a valid licence", () => {
    // Arrange
    const item = makePistol("00000000-0000-0000-0000-000000000001")
    const licenseId = "00000000-0000-0000-0000-000000000099"
    const licensedSibling = makePistol("00000000-0000-0000-0000-000000000002", { licenseId })
    const license: LicenseData = { kind: EntityKind.item, id: licenseId, itemType: ItemType.license, name: "License", rating: 4 }

    // Act
    const siblings = findLicenseableSiblings(item, [item, licensedSibling], [license])

    // Assert
    expect(siblings).toEqual([])
  })

  it("excludes items with a different name or item type", () => {
    // Arrange
    const item = makePistol("00000000-0000-0000-0000-000000000001")
    const differentName = makePistol("00000000-0000-0000-0000-000000000002", { name: "Ares Viper" })
    const differentType = makePistol("00000000-0000-0000-0000-000000000003", { itemType: ItemType.armor })

    // Act
    const siblings = findLicenseableSiblings(item, [item, differentName, differentType], [])

    // Assert
    expect(siblings).toEqual([])
  })
})

describe("getLicenseCost", () => {
  it("is free for a real SIN's licence", () => {
    // Arrange / Act / Assert
    expect(getLicenseCost("real")).toBe(0)
  })

  it("scales with rating for a fake licence", () => {
    // Arrange / Act / Assert
    expect(getLicenseCost(4)).toBe(400)
  })
})

describe("DefaultFakeLicenseRating", () => {
  it("is rating 3", () => {
    // Arrange / Act / Assert
    expect(DefaultFakeLicenseRating).toBe(3)
  })
})
