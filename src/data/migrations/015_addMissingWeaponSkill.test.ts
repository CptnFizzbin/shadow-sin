import { describe, expect, it } from "vitest"

import migration from "./015_addMissingWeaponSkill.ts"

describe.concurrent("015_addMissingWeaponSkill", () => {
  it("sets automatics skill for a firearm without a skill", () => {
    // Arrange
    const input = {
      gear: {
        "weapon-1": {
          itemType: "weapon",
          weaponType: "firearm",
          firemodes: ["SA"],
          ammo: { size: 10, remaining: 10, type: "clip" },
        },
      },
    }

    // Act
    const result = migration.up(input)

    // Assert
    expect(result.gear?.["weapon-1"].skill).toBe("automatics")
  })

  it("sets unarmedCombat skill for a melee weapon without a skill", () => {
    // Arrange
    const input = {
      gear: {
        "weapon-2": {
          itemType: "weapon",
          weaponType: "melee",
        },
      },
    }

    // Act
    const result = migration.up(input)

    // Assert
    expect(result.gear?.["weapon-2"].skill).toBe("unarmedCombat")
  })

  it("does not overwrite an existing skill", () => {
    // Arrange
    const input = {
      gear: {
        "weapon-3": {
          itemType: "weapon",
          weaponType: "firearm",
          skill: "pistols",
          firemodes: ["SA"],
          ammo: { size: 17, remaining: 17, type: "clip" },
        },
      },
    }

    // Act
    const result = migration.up(input)

    // Assert
    expect(result.gear?.["weapon-3"].skill).toBe("pistols")
  })

  it("adds default SA/BF/FA firemodes for a firearm missing firemodes", () => {
    // Arrange
    const input = {
      gear: {
        "weapon-4": {
          itemType: "weapon",
          weaponType: "firearm",
          skill: "automatics",
          ammo: { size: 30, remaining: 30, type: "clip" },
        },
      },
    }

    // Act
    const result = migration.up(input)

    // Assert
    expect(result.gear?.["weapon-4"].firemodes).toEqual(["SA", "BF", "FA"])
  })

  it("adds default ammo for a firearm missing ammo", () => {
    // Arrange
    const input = {
      gear: {
        "weapon-5": {
          itemType: "weapon",
          weaponType: "firearm",
          skill: "automatics",
          firemodes: ["SA"],
        },
      },
    }

    // Act
    const result = migration.up(input)

    // Assert
    expect(result.gear?.["weapon-5"].ammo).toEqual({ size: 0, remaining: 0, type: "clip" })
  })

  it("skips non-weapon gear", () => {
    // Arrange
    const input = {
      gear: {
        "armor-1": {
          itemType: "armor",
        },
      },
    }

    // Act
    const result = migration.up(input)

    // Assert
    expect(result.gear?.["armor-1"]).not.toHaveProperty("skill")
  })

  it("handles characters with no gear", () => {
    // Arrange
    const input = {}

    // Act
    const result = migration.up(input)

    // Assert
    expect(result).toEqual({})
  })
})
