import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { awakenings, AwakeningType } from "#/lib/system/awakening-type.ts"
import { metatypes, MetatypeType } from "#/lib/system/metatype-data.ts"

import { clampValue, createAttrInfo } from "#/components/Attributes/attribute-info.ts"

const humanMetatype = metatypes[MetatypeType.Human]
const mundaneAwakening = awakenings[AwakeningType.Mundane]
const adeptAwakening = awakenings[AwakeningType.Adept]
const technomancerAwakening = awakenings[AwakeningType.Technomancer]

describe("clampValue", () => {
  it("returns the value when within range", () => {
    // Arrange / Act / Assert
    expect(clampValue(1, 4, 6)).toBe(4)
  })

  it("clamps to min when value is below min", () => {
    // Arrange / Act / Assert
    expect(clampValue(1, 0, 6)).toBe(1)
  })

  it("clamps to max when value is above max", () => {
    // Arrange / Act / Assert
    expect(clampValue(1, 10, 6)).toBe(6)
  })

  it("returns min when value equals min", () => {
    // Arrange / Act / Assert
    expect(clampValue(1, 1, 6)).toBe(1)
  })

  it("returns max when value equals max", () => {
    // Arrange / Act / Assert
    expect(clampValue(1, 6, 6)).toBe(6)
  })

  it("handles min equal to max (single valid value)", () => {
    // Arrange / Act / Assert
    expect(clampValue(3, 5, 3)).toBe(3)
  })
})

describe("createAttrInfo", () => {
  describe("essence attribute", () => {
    it("always returns fixed essence values regardless of metatype or awakening", () => {
      // Arrange
      const options = {
        attr: AttributeKey.essence,
        value: 3,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result).toEqual({
        attr: AttributeKey.essence,
        value: 6,
        min: 0,
        max: 6,
        augMax: 6,
      })
    })

    it("ignores provided value for essence and always returns 6", () => {
      // Arrange
      const options = {
        attr: AttributeKey.essence,
        value: 4,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.value).toBe(6)
    })
  })

  describe("magic attribute", () => {
    it("uses awakening data for magic attribute min and max", () => {
      // Arrange
      const options = {
        attr: AttributeKey.magic,
        value: 3,
        metatype: humanMetatype,
        awakening: adeptAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.min).toBe(adeptAwakening.attributes.magic.min)
      expect(result.max).toBe(adeptAwakening.attributes.magic.max)
      expect(result.augMax).toBe(adeptAwakening.attributes.magic.max)
    })

    it("returns magic value of 0 for Mundane awakening", () => {
      // Arrange
      const options = {
        attr: AttributeKey.magic,
        value: 0,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.value).toBe(0)
      expect(result.max).toBe(0)
    })

    it("clamps magic value to awakening max", () => {
      // Arrange
      const options = {
        attr: AttributeKey.magic,
        value: 10,
        metatype: humanMetatype,
        awakening: adeptAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.value).toBe(adeptAwakening.attributes.magic.max)
    })
  })

  describe("resonance attribute", () => {
    it("uses awakening data for resonance attribute", () => {
      // Arrange
      const options = {
        attr: AttributeKey.resonance,
        value: 4,
        metatype: humanMetatype,
        awakening: technomancerAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.min).toBe(technomancerAwakening.attributes.resonance.min)
      expect(result.max).toBe(technomancerAwakening.attributes.resonance.max)
    })
  })

  describe("standard physical/mental attributes", () => {
    it("uses metatype data for body attribute", () => {
      // Arrange
      const options = {
        attr: AttributeKey.body,
        value: 3,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.min).toBe(humanMetatype.attributes.body.min)
      expect(result.max).toBe(humanMetatype.attributes.body.max)
      expect(result.augMax).toBe(humanMetatype.attributes.body.augMax)
    })

    it("returns the provided value within valid range", () => {
      // Arrange
      const options = {
        attr: AttributeKey.strength,
        value: 4,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.value).toBe(4)
    })

    it("clamps value to metatype minimum when below min", () => {
      // Arrange
      const options = {
        attr: AttributeKey.body,
        value: 0,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.value).toBe(humanMetatype.attributes.body.min)
    })

    it("clamps value to metatype maximum when above max", () => {
      // Arrange
      const options = {
        attr: AttributeKey.agility,
        value: 99,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.value).toBe(humanMetatype.attributes.agility.max)
    })

    it("defaults value to 0 when no value provided, then clamps to min", () => {
      // Arrange
      const options = {
        attr: AttributeKey.body,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      // value defaults to 0, which is below human body min of 1
      expect(result.value).toBe(humanMetatype.attributes.body.min)
    })

    it("includes attr key in the result", () => {
      // Arrange
      const options = {
        attr: AttributeKey.charisma,
        value: 2,
        metatype: humanMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.attr).toBe(AttributeKey.charisma)
    })
  })

  describe("Troll metatype specific constraints", () => {
    it("uses troll-specific attribute ranges", () => {
      // Arrange
      const trollMetatype = metatypes[MetatypeType.Troll]
      const options = {
        attr: AttributeKey.body,
        value: 7,
        metatype: trollMetatype,
        awakening: mundaneAwakening,
      }

      // Act
      const result = createAttrInfo(options)

      // Assert
      expect(result.min).toBe(trollMetatype.attributes.body.min) // 5
      expect(result.max).toBe(trollMetatype.attributes.body.max) // 10
      expect(result.value).toBe(7)
    })
  })
})