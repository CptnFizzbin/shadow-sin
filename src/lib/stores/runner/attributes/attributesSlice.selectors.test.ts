import { describe, expect, it } from "vitest"

import { NullUuid } from "#/lib/uuidUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { MetatypeType } from "#/system/metatypeData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { forAttr, selectAttributes } from "./attributesSlice.selectors.ts"

describe("selectAttributes", () => {
  it("returns the runner sheet's raw attributes map", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.attributes.body = 4
      return s
    })

    // Act
    const attributes = selectAttributes(sheet)

    // Assert
    expect(attributes.body).toBe(4)
  })
})

describe("forAttr.baseValue", () => {
  it("returns the stored rating for a populated attribute", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.attributes.body = 4
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.body).baseValue(sheet)).toBe(4)
  })

  it("returns null for an attribute the sheet never set", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      delete s.attributes.resonance
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.resonance).baseValue(sheet)).toBeNull()
  })
})

describe("forAttr.min / naturalMax / augmentedMax", () => {
  describe.each([
    { metatype: MetatypeType.Troll, attr: AttributeKey.body, min: 5, naturalMax: 10, augmentedMax: 15 },
    { metatype: MetatypeType.Elf, attr: AttributeKey.agility, min: 2, naturalMax: 7, augmentedMax: 10 },
  ])("$metatype $attr", ({ metatype, attr, min, naturalMax, augmentedMax }) => {
    it("resolves min/naturalMax/augmentedMax from the runner's metatype", () => {
      // Arrange
      const sheet = runnerDataFactory((s) => {
        s.biology.metatype = metatype
        return s
      })

      // Act
      const attrSelectors = forAttr(attr)

      // Assert
      expect(attrSelectors.min(sheet)).toBe(min)
      expect(attrSelectors.naturalMax(sheet)).toBe(naturalMax)
      expect(attrSelectors.augmentedMax(sheet)).toBe(augmentedMax)
    })
  })

  it("resolves Magic and Resonance from the runner's awakening instead of metatype", () => {
    // Arrange
    const magician = runnerDataFactory((s) => {
      s.biology.awakening = AwakeningType.Magician
      return s
    })
    const technomancer = runnerDataFactory((s) => {
      s.biology.awakening = AwakeningType.Technomancer
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.magic).naturalMax(magician)).toBe(6)
    expect(forAttr(AttributeKey.resonance).naturalMax(magician)).toBe(0)
    expect(forAttr(AttributeKey.resonance).naturalMax(technomancer)).toBe(6)
    // Magic/Resonance have no separate augmented maximum — cyberware can't raise them.
    expect(forAttr(AttributeKey.magic).augmentedMax(magician)).toBe(6)
  })

  it("raises naturalMax by 1 when the runner has a matching Exceptional Attribute Quality", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.qualities = [{ id: NullUuid, name: "Exceptional Attribute (Logic)", type: "positive" }]
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.logic).naturalMax(sheet)).toBe(7)
  })
})

describe("forAttr.value", () => {
  it("returns null when the attribute isn't set on the sheet, without applying modifiers", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      delete s.attributes.resonance
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.resonance).value(sheet)).toBeNull()
  })

  it("equals baseValue when no modifiers apply", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.attributes.logic = 4
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.logic).value(sheet)).toBe(4)
  })

  it("adds attrMod GameEffects from equipped gear, qualities, and other sources", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.attributes.logic = 4
      s.qualities = [
        {
          id: NullUuid,
          name: "Analytical Mind",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.logic, value: 1 }],
        },
      ]
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.logic).value(sheet)).toBe(5)
  })

  it("clamps the modified total to the attribute's augmented maximum", () => {
    // Arrange
    const sheet = runnerDataFactory((s) => {
      s.biology.metatype = MetatypeType.Human
      s.attributes.body = 6 // Human's natural max
      s.qualities = [
        {
          id: NullUuid,
          name: "Cybernetic Boost",
          type: "positive",
          effects: [{ type: GameEffectType.attrMod, target: AttributeKey.body, value: 10 }],
        },
      ]
      return s
    })

    // Act + Assert
    expect(forAttr(AttributeKey.body).value(sheet)).toBe(9) // Human's augmented max
  })
})
