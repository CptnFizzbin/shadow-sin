import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { awakenings, AwakeningType } from "#/lib/system/awakening-type.ts"
import { metatypes, MetatypeType } from "#/lib/system/metatype-data.ts"

import { getAttributesValues } from "#/components/Attributes/get-attributes-values.ts"

const humanMetatype = metatypes[MetatypeType.Human]
const mundaneAwakening = awakenings[AwakeningType.Mundane]
const adeptAwakening = awakenings[AwakeningType.Adept]
const technomancerAwakening = awakenings[AwakeningType.Technomancer]

describe("getAttributesValues", () => {
  it("returns an object with all AttributeKey fields", () => {
    // Arrange / Act
    const result = getAttributesValues(humanMetatype, mundaneAwakening)

    // Assert
    for (const key of Object.values(AttributeKey)) {
      expect(result).toHaveProperty(key)
    }
  })

  it("uses provided attribute values when within valid range", () => {
    // Arrange
    const values = {
      body: 3,
      agility: 4,
      reaction: 2,
      strength: 5,
      charisma: 1,
      intuition: 3,
      logic: 2,
      willpower: 4,
      edge: 3,
      essence: 6,
      magic: 0,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(humanMetatype, mundaneAwakening, values)

    // Assert
    expect(result.body).toBe(3)
    expect(result.agility).toBe(4)
    expect(result.reaction).toBe(2)
    expect(result.strength).toBe(5)
    expect(result.charisma).toBe(1)
    expect(result.intuition).toBe(3)
    expect(result.logic).toBe(2)
    expect(result.willpower).toBe(4)
    expect(result.edge).toBe(3)
  })

  it("clamps attribute values below minimum to the metatype minimum", () => {
    // Arrange
    const values = {
      body: 0,
      agility: 0,
      reaction: 0,
      strength: 0,
      charisma: 0,
      intuition: 0,
      logic: 0,
      willpower: 0,
      edge: 0,
      essence: 6,
      magic: 0,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(humanMetatype, mundaneAwakening, values)

    // Assert
    expect(result.body).toBe(humanMetatype.attributes.body.min)
    expect(result.agility).toBe(humanMetatype.attributes.agility.min)
    expect(result.charisma).toBe(humanMetatype.attributes.charisma.min)
  })

  it("clamps attribute values above maximum to the metatype maximum", () => {
    // Arrange
    const values = {
      body: 99,
      agility: 99,
      reaction: 99,
      strength: 99,
      charisma: 99,
      intuition: 99,
      logic: 99,
      willpower: 99,
      edge: 99,
      essence: 6,
      magic: 0,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(humanMetatype, mundaneAwakening, values)

    // Assert
    expect(result.body).toBe(humanMetatype.attributes.body.max)
    expect(result.strength).toBe(humanMetatype.attributes.strength.max)
    expect(result.logic).toBe(humanMetatype.attributes.logic.max)
  })

  it("always sets essence to 6 regardless of provided value", () => {
    // Arrange
    const values = {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      charisma: 3,
      intuition: 3,
      logic: 3,
      willpower: 3,
      edge: 3,
      essence: 4,
      magic: 0,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(humanMetatype, mundaneAwakening, values)

    // Assert
    expect(result.essence).toBe(6)
  })

  it("sets magic from awakening data when awakening type has magic", () => {
    // Arrange
    const values = {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      charisma: 3,
      intuition: 3,
      logic: 3,
      willpower: 3,
      edge: 3,
      essence: 6,
      magic: 4,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(humanMetatype, adeptAwakening, values)

    // Assert
    expect(result.magic).toBe(4)
  })

  it("sets magic to 0 for Mundane awakening type", () => {
    // Arrange
    const values = {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      charisma: 3,
      intuition: 3,
      logic: 3,
      willpower: 3,
      edge: 3,
      essence: 6,
      magic: 3,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(humanMetatype, mundaneAwakening, values)

    // Assert
    expect(result.magic).toBe(0)
  })

  it("sets resonance from awakening data for Technomancer", () => {
    // Arrange
    const values = {
      body: 3,
      agility: 3,
      reaction: 3,
      strength: 3,
      charisma: 3,
      intuition: 3,
      logic: 3,
      willpower: 3,
      edge: 3,
      essence: 6,
      magic: 0,
      resonance: 5,
    }

    // Act
    const result = getAttributesValues(humanMetatype, technomancerAwakening, values)

    // Assert
    expect(result.resonance).toBe(5)
    expect(result.magic).toBe(0)
  })

  it("returns default minimum values when no values are provided", () => {
    // Arrange / Act
    const result = getAttributesValues(humanMetatype, mundaneAwakening)

    // Assert
    // All physical/mental attrs default to 0 then get clamped to metatype min
    expect(result.body).toBe(humanMetatype.attributes.body.min)
    expect(result.agility).toBe(humanMetatype.attributes.agility.min)
    expect(result.essence).toBe(6) // Essence is always 6
    expect(result.magic).toBe(0) // Mundane has 0 magic
    expect(result.resonance).toBe(0) // Mundane has 0 resonance
  })

  it("applies Ork metatype-specific ranges", () => {
    // Arrange
    const orkMetatype = metatypes[MetatypeType.Ork]
    const values = {
      body: 6,
      agility: 3,
      reaction: 3,
      strength: 5,
      charisma: 2,
      intuition: 3,
      logic: 3,
      willpower: 3,
      edge: 3,
      essence: 6,
      magic: 0,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(orkMetatype, mundaneAwakening, values)

    // Assert
    expect(result.body).toBe(6) // Within ork range 4-9
    expect(result.strength).toBe(5) // Within ork range 3-8
    expect(result.charisma).toBe(2) // Within ork range 1-5
  })

  it("boundary: accepts the exact maximum attribute value", () => {
    // Arrange
    const values = {
      body: humanMetatype.attributes.body.max,
      agility: humanMetatype.attributes.agility.max,
      reaction: humanMetatype.attributes.reaction.max,
      strength: humanMetatype.attributes.strength.max,
      charisma: humanMetatype.attributes.charisma.max,
      intuition: humanMetatype.attributes.intuition.max,
      logic: humanMetatype.attributes.logic.max,
      willpower: humanMetatype.attributes.willpower.max,
      edge: humanMetatype.attributes.edge.max,
      essence: 6,
      magic: adeptAwakening.attributes.magic.max,
      resonance: 0,
    }

    // Act
    const result = getAttributesValues(humanMetatype, adeptAwakening, values)

    // Assert
    expect(result.body).toBe(humanMetatype.attributes.body.max)
    expect(result.magic).toBe(adeptAwakening.attributes.magic.max)
  })
})