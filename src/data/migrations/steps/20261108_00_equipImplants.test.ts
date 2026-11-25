import { describe, expect, it } from "vitest"

import migration from "./20261108_00_equipImplants.ts"

describe.concurrent("equipImplants", () => {
  it("equips an unequipped implant", () => {
    // Arrange
    const character = { _data_: { items: { wiredReflexes: { itemType: "implant", equipped: false } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.wiredReflexes).toEqual({ itemType: "implant", equipped: true })
  })

  it("equips an implant with no equipped field", () => {
    // Arrange
    const character = { _data_: { items: { datajack: { itemType: "implant" } } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.datajack).toEqual({ itemType: "implant", equipped: true })
  })

  it("leaves other items untouched", () => {
    // Arrange
    const armorJacket = { itemType: "armor", equipped: false }
    const character = { _data_: { items: { armorJacket } } }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result._data_?.items?.armorJacket).toEqual(armorJacket)
  })
})
