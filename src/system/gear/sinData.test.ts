import { describe, expect, it } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import { ItemType } from "#/system/itemType.ts"

import { SinDataSchema } from "./sinData.ts"

const baseFields = {
  kind: EntityKind.item,
  id: crypto.randomUUID(),
  itemType: ItemType.sin,
  name: "National ID",
  items: { parentId: null, childIds: [] },
}

describe.concurrent("SinDataSchema", () => {
  it("validates a Real SIN (isReal: true, no rating)", () => {
    // Arrange
    const sin = { ...baseFields, isReal: true }

    // Act
    const result = SinDataSchema.safeParse(sin)

    // Assert
    expect(result.success).toBe(true)
  })

  it("validates a fake SIN (isReal: false, with a rating)", () => {
    // Arrange
    const sin = { ...baseFields, isReal: false, rating: 4 }

    // Act
    const result = SinDataSchema.safeParse(sin)

    // Assert
    expect(result.success).toBe(true)
  })

  it("rejects isReal: true combined with a rating", () => {
    // Arrange
    const sin = { ...baseFields, isReal: true, rating: 4 }

    // Act
    const result = SinDataSchema.safeParse(sin)

    // Assert
    expect(result.success).toBe(false)
  })

  it("rejects isReal: false with no rating", () => {
    // Arrange
    const sin = { ...baseFields, isReal: false }

    // Act
    const result = SinDataSchema.safeParse(sin)

    // Assert
    expect(result.success).toBe(false)
  })
})
