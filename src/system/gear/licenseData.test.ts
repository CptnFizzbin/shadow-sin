import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import { ItemType } from "#/system/itemType.ts"

import { LicenseDataSchema } from "./licenseData.ts"

const baseFields = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  itemType: ItemType.license,
  name: "License: Ares Predator",
  items: { parentId: null, childIds: [] },
}

describe.concurrent("LicenseDataSchema", () => {
  it("validates a Real Licence (isReal: true, no rating)", () => {
    // Arrange
    const license = { ...baseFields, isReal: true }

    // Act
    const result = LicenseDataSchema.safeParse(license)

    // Assert
    expect(result.success).toBe(true)
  })

  it("validates a fake Licence (isReal: false, with a rating)", () => {
    // Arrange
    const license = { ...baseFields, isReal: false, rating: 4 }

    // Act
    const result = LicenseDataSchema.safeParse(license)

    // Assert
    expect(result.success).toBe(true)
  })

  it("rejects isReal: true combined with a rating", () => {
    // Arrange
    const license = { ...baseFields, isReal: true, rating: 4 }

    // Act
    const result = LicenseDataSchema.safeParse(license)

    // Assert
    expect(result.success).toBe(false)
  })

  it("rejects isReal: false with no rating", () => {
    // Arrange
    const license = { ...baseFields, isReal: false }

    // Act
    const result = LicenseDataSchema.safeParse(license)

    // Assert
    expect(result.success).toBe(false)
  })
})
