import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

import { RatingFormulas } from "./ratingFormulas.ts"

describe.concurrent("RatingFormulas.getModifiers", () => {
  it("names each matching effect after its source", () => {
    // Arrange
    const sourcedEffects = [
      { sourceName: "Muscle Toner", effect: { type: GameEffectType.attrMod, target: AttributeKey.agility, value: 2 } },
      { sourceName: "Muscle Toner", effect: { type: GameEffectType.attrMod, target: AttributeKey.strength, value: 1 } },
      { sourceName: "Reflex Recorder", effect: { type: GameEffectType.skillMod, target: AttributeKey.agility, value: 1 } },
    ]

    // Act
    const modifiers = RatingFormulas.getModifiers({
      sourcedEffects,
      type: GameEffectType.attrMod,
      target: AttributeKey.agility,
    })

    // Assert
    expect(modifiers).toEqual([{ name: "Muscle Toner", value: 2 }])
  })

  it("also matches subTarget when one is given", () => {
    // Arrange
    const sourcedEffects = [
      { sourceName: "Focus", effect: { type: GameEffectType.skillSpecializationMod, target: SkillKey.pistols, subTarget: "Revolvers", value: 1 } },
      { sourceName: "Other", effect: { type: GameEffectType.skillSpecializationMod, target: SkillKey.pistols, subTarget: "Tasers", value: 3 } },
    ]

    // Act
    const modifiers = RatingFormulas.getModifiers({
      sourcedEffects,
      type: GameEffectType.skillSpecializationMod,
      target: SkillKey.pistols,
      subTarget: "Revolvers",
    })

    // Assert
    expect(modifiers).toEqual([{ name: "Focus", value: 1 }])
  })
})

describe.concurrent("RatingFormulas.getAttrRating", () => {
  it("adds modifiers to the raw value", () => {
    // Arrange / Act
    const breakdown = RatingFormulas.getAttrRating({
      rawValue: 4,
      modifiers: [{ name: "Muscle Toner", value: 2 }],
      augmentedMax: 9,
    })

    // Assert
    expect(breakdown).toEqual({ rawValue: 4, modifiers: [{ name: "Muscle Toner", value: 2 }], rating: 6 })
  })

  it("caps at the augmented maximum and lists the cap as a modifier", () => {
    // Arrange / Act
    const breakdown = RatingFormulas.getAttrRating({
      rawValue: 6,
      modifiers: [{ name: "Muscle Toner", value: 5 }],
      augmentedMax: 9,
    })

    // Assert
    expect(breakdown).toEqual({
      rawValue: 6,
      modifiers: [{ name: "Muscle Toner", value: 5 }, { name: "Augmented maximum", value: -2 }],
      rating: 9,
    })
  })

  it("doesn't cap when no augmented maximum is given", () => {
    // Arrange / Act
    const breakdown = RatingFormulas.getAttrRating({ rawValue: 6, modifiers: [{ name: "Boost", value: 5 }] })

    // Assert
    expect(breakdown.rating).toBe(11)
  })
})

describe.concurrent("RatingFormulas.getSkillRating", () => {
  it("adds modifiers to the raw value", () => {
    // Arrange / Act
    const breakdown = RatingFormulas.getSkillRating({ rawValue: 3, modifiers: [{ name: "Skillwire", value: 1 }] })

    // Assert
    expect(breakdown).toEqual({ rawValue: 3, modifiers: [{ name: "Skillwire", value: 1 }], rating: 4 })
  })
})
