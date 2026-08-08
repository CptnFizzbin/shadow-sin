import { describe, expect, it } from "vitest"

import migration from "./011_splitPainToleranceEffects.ts"

describe("011_splitPainToleranceEffects", () => {
  it("converts positive painTolerance in qualities to highPainTolerance", () => {
    // Arrange
    const character = {
      qualities: [
        {
          id: "q1",
          name: "High Pain Tolerance",
          type: "positive",
          effects: [{ type: "painTolerance", target: "physical", value: 3 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].effects?.[0].type).toBe("highPainTolerance")
  })

  it("converts negative painTolerance in qualities to lowPainTolerance", () => {
    // Arrange
    const character = {
      qualities: [
        {
          id: "q1",
          name: "Low Pain Tolerance",
          type: "negative",
          effects: [{ type: "painTolerance", target: "physical", value: -1 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].effects?.[0].type).toBe("lowPainTolerance")
  })

  it("converts zero-value painTolerance in qualities to highPainTolerance", () => {
    // Arrange
    const character = {
      qualities: [
        {
          id: "q1",
          name: "Odd Quality",
          type: "positive",
          effects: [{ type: "painTolerance", target: "all", value: 0 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].effects?.[0].type).toBe("highPainTolerance")
  })

  it("converts painTolerance in gear item effects", () => {
    // Arrange
    const character = {
      gear: {
        "item-1": {
          name: "Pain Editor",
          itemType: "implant",
          equipped: true,
          effects: [{ type: "painTolerance", target: "physical", value: 2 }],
        },
      },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.gear?.["item-1"].effects?.[0].type).toBe("highPainTolerance")
  })

  it("converts painTolerance in spells", () => {
    // Arrange
    const character = {
      spells: [
        {
          id: "s1",
          name: "Agony",
          effects: [{ type: "painTolerance", target: "all", value: -1 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.spells?.[0].effects?.[0].type).toBe("lowPainTolerance")
  })

  it("converts painTolerance in complexForms", () => {
    // Arrange
    const character = {
      complexForms: [
        {
          id: "cf1",
          name: "Pain Buffer",
          effects: [{ type: "painTolerance", target: "stun", value: 1 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.complexForms?.[0].effects?.[0].type).toBe("highPainTolerance")
  })

  it("converts painTolerance in adeptPowers", () => {
    // Arrange
    const character = {
      adeptPowers: [
        {
          id: "ap1",
          name: "Pain Resistance",
          rating: 2,
          effects: [{ type: "painTolerance", target: "physical", value: 2 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.adeptPowers?.[0].effects?.[0].type).toBe("highPainTolerance")
  })

  it("leaves non-painTolerance effects unchanged", () => {
    // Arrange
    const character = {
      qualities: [
        {
          id: "q1",
          name: "Ambidextrous",
          type: "positive",
          effects: [{ type: "dicePoolMod", target: "offHand", value: 2 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].effects?.[0].type).toBe("dicePoolMod")
  })

  it("handles characters with no effects collections", () => {
    // Arrange
    const character = {}

    // Act
    const result = migration.up(character)

    // Assert
    expect(result).not.toHaveProperty("qualities")
    expect(result).not.toHaveProperty("gear")
    expect(result).not.toHaveProperty("spells")
    expect(result).not.toHaveProperty("complexForms")
    expect(result).not.toHaveProperty("adeptPowers")
  })

  it("handles items with no effects array", () => {
    // Arrange
    const character = {
      qualities: [{ id: "q1", name: "Tough", type: "positive" }],
      gear: { "item-1": { name: "Sword", itemType: "weapon" } },
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0]).not.toHaveProperty("effects")
    expect(result.gear?.["item-1"]).not.toHaveProperty("effects")
  })

  it("converts multiple effects in a single item, preserving unrelated ones", () => {
    // Arrange
    const character = {
      qualities: [
        {
          id: "q1",
          name: "Mixed Quality",
          type: "positive",
          effects: [
            { type: "painTolerance", target: "physical", value: 2 },
            { type: "attrMod", target: "body", value: 1 },
            { type: "painTolerance", target: "stun", value: -1 },
          ],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert
    expect(result.qualities?.[0].effects?.[0].type).toBe("highPainTolerance")
    expect(result.qualities?.[0].effects?.[1].type).toBe("attrMod")
    expect(result.qualities?.[0].effects?.[2].type).toBe("lowPainTolerance")
  })

  it("does nothing when _meta_.version is already at or past this migration", () => {
    // Arrange
    const character = {
      _meta_: { version: 11 },
      qualities: [
        {
          id: "q1",
          name: "High Pain Tolerance",
          type: "positive",
          effects: [{ type: "painTolerance", target: "physical", value: 3 }],
        },
      ],
    }

    // Act
    const result = migration.up(character)

    // Assert — the effect type was left untouched
    expect(result.qualities?.[0].effects?.[0].type).toBe("painTolerance")
  })
})
