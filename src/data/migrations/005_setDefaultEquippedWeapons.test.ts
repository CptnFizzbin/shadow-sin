import { describe, expect, it } from "vitest"

import { WeaponType } from "#/system/gear/weaponData.ts"

import migration from "./005_setDefaultEquippedWeapons.ts"

describe("005_setDefaultEquippedWeapons", () => {
  it("returns the character unchanged when there is no gear", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear).toEqual({})
  })

  it("equips the first melee weapon when no melee weapons are equipped", () => {
    // Arrange
    const character = {
      gear: {
        m1: { id: "m1", itemType: "weapon", weaponType: WeaponType.melee, equipped: false },
        m2: { id: "m2", itemType: "weapon", weaponType: WeaponType.melee, equipped: false },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.m1.equipped).toBe(true)
    expect(result.gear?.m2.equipped).toBe(false)
  })

  it("equips the first ranged weapon when no ranged weapons are equipped", () => {
    // Arrange
    const character = {
      gear: {
        r1: { id: "r1", itemType: "weapon", weaponType: WeaponType.firearm, equipped: false },
        r2: { id: "r2", itemType: "weapon", weaponType: WeaponType.projectile, equipped: false },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.r1.equipped).toBe(true)
    expect(result.gear?.r2.equipped).toBe(false)
  })

  it("does not change anything when one of each category is already equipped", () => {
    // Arrange
    const character = {
      gear: {
        m1: { id: "m1", itemType: "weapon", weaponType: WeaponType.melee, equipped: true },
        m2: { id: "m2", itemType: "weapon", weaponType: WeaponType.melee, equipped: false },
        r1: { id: "r1", itemType: "weapon", weaponType: WeaponType.firearm, equipped: true },
        r2: { id: "r2", itemType: "weapon", weaponType: WeaponType.firearm, equipped: false },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.m1.equipped).toBe(true)
    expect(result.gear?.m2.equipped).toBe(false)
    expect(result.gear?.r1.equipped).toBe(true)
    expect(result.gear?.r2.equipped).toBe(false)
  })

  it("ignores child weapons (those with a parentId)", () => {
    // Arrange — only the standalone weapon should be considered
    const character = {
      gear: {
        m1: {
          id: "m1",
          itemType: "weapon",
          weaponType: WeaponType.melee,
          equipped: false,
          parentId: "container",
        },
        m2: { id: "m2", itemType: "weapon", weaponType: WeaponType.melee, equipped: false },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.m1.equipped).toBe(false)
    expect(result.gear?.m2.equipped).toBe(true)
  })

  it("treats thrown weapons as melee", () => {
    // Arrange
    const character = {
      gear: {
        t1: { id: "t1", itemType: "weapon", weaponType: WeaponType.thrown, equipped: false },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.t1.equipped).toBe(true)
  })

  it("does nothing when there are no weapons of a given category", () => {
    // Arrange — only a melee weapon, no ranged weapons exist
    const character = {
      gear: {
        m1: { id: "m1", itemType: "weapon", weaponType: WeaponType.melee, equipped: false },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.m1.equipped).toBe(true)
    expect(Object.keys(result.gear ?? {})).toHaveLength(1)
  })
})
