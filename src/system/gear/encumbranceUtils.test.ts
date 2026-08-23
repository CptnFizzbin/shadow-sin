import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { EntityKind } from "#/system/entityKind.ts"
import { ItemType } from "#/system/itemType.ts"

import type { ArmorData } from "./armorData.ts"
import { calculateArmorBulk, calculateArmorTotals, calculateEncumbrancePenalty } from "./encumbranceUtils.ts"

function armor(overrides: Partial<ArmorData>): ArmorData {
  return {
    kind: EntityKind.item, items: { parentId: null, childIds: [] },
    id: NullUuid,
    itemType: ItemType.armor,
    name: "Armor",
    ballistic: 0,
    impact: 0,
    ...overrides,
  }
}

describe.concurrent("calculateArmorTotals", () => {
  it("takes the highest rating among base armor rather than summing them", () => {
    // Arrange
    const equipped = [
      armor({ name: "Armor Jacket", ballistic: 6, impact: 4 }),
      armor({ name: "Full Body Armor", ballistic: 8, impact: 6 }),
    ]

    // Act
    const totals = calculateArmorTotals(equipped)

    // Assert
    expect(totals).toEqual({ ballistic: 8, impact: 6 })
  })

  it("adds modifier armor on top of the highest base rating", () => {
    // Arrange
    const equipped = [
      armor({ name: "Full Body Armor", ballistic: 8, impact: 6 }),
      armor({ name: "Helmet", ballistic: 2, impact: 2, isModifier: true }),
    ]

    // Act
    const totals = calculateArmorTotals(equipped)

    // Assert
    expect(totals).toEqual({ ballistic: 10, impact: 8 })
  })

  it("stacks multiple modifier items additively", () => {
    // Arrange
    const equipped = [
      armor({ name: "Helmet", ballistic: 2, impact: 2, isModifier: true }),
      armor({ name: "Shield", ballistic: 3, impact: 1, isModifier: true }),
    ]

    // Act
    const totals = calculateArmorTotals(equipped)

    // Assert
    expect(totals).toEqual({ ballistic: 5, impact: 3 })
  })

  it("accounts for damage when picking the highest base rating", () => {
    // Arrange
    const equipped = [
      armor({ name: "Armor Jacket", ballistic: 6, impact: 4 }),
      armor({ name: "Full Body Armor", ballistic: 8, impact: 6, damage: { ballistic: 5, impact: 0 } }),
    ]

    // Act
    const totals = calculateArmorTotals(equipped)

    // Assert
    expect(totals).toEqual({ ballistic: 6, impact: 6 })
  })

  it("returns zero totals when nothing is equipped", () => {
    expect(calculateArmorTotals([])).toEqual({ ballistic: 0, impact: 0 })
  })
})

describe.concurrent("calculateArmorBulk", () => {
  it("sums every equipped item's rating regardless of Base/Modifier", () => {
    // Arrange
    const equipped = [
      armor({ name: "Armor 1", ballistic: 8, impact: 6 }),
      armor({ name: "Armor 2", ballistic: 5, impact: 7 }),
      armor({ name: "Armor 3", ballistic: 2, impact: 0, isModifier: true }),
      armor({ name: "Armor 4", ballistic: 0, impact: 3, isModifier: true }),
    ]

    // Act
    const bulk = calculateArmorBulk(equipped)

    // Assert
    expect(bulk).toEqual({ ballistic: 15, impact: 16 })
  })

  it("does not subtract damage, since damage doesn't reduce bulk", () => {
    // Arrange
    const equipped = [
      armor({ name: "Full Body Armor", ballistic: 8, impact: 6, damage: { ballistic: 5, impact: 0 } }),
    ]

    // Act
    const bulk = calculateArmorBulk(equipped)

    // Assert
    expect(bulk).toEqual({ ballistic: 8, impact: 6 })
  })

  it("returns zero bulk when nothing is equipped", () => {
    expect(calculateArmorBulk([])).toEqual({ ballistic: 0, impact: 0 })
  })
})

describe.concurrent("calculateEncumbrancePenalty", () => {
  it("returns zero when totals are within the body threshold", () => {
    expect(calculateEncumbrancePenalty(6, 4, 4)).toBe(0)
  })

  it("penalizes based on whichever of ballistic or impact exceeds the threshold more", () => {
    expect(calculateEncumbrancePenalty(11, 5, 4)).toBe(2)
  })
})
