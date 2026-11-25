import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { GameEffectType } from "#/data/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/data/skills/skillKey.ts"

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

  it("marks all but the highest of the effects sharing a stacking tag as overridden", () => {
    // Arrange
    const sourcedEffects = [
      { sourceName: "Jazz", effect: { type: GameEffectType.attrMod, target: AttributeKey.reaction, value: 1, tags: ["drug"] } },
      { sourceName: "Kamikaze", effect: { type: GameEffectType.attrMod, target: AttributeKey.reaction, value: 2, tags: ["drug"] } },
      { sourceName: "Wired Reflexes", effect: { type: GameEffectType.attrMod, target: AttributeKey.reaction, value: 1 } },
    ]

    // Act
    const modifiers = RatingFormulas.getModifiers({
      sourcedEffects,
      type: GameEffectType.attrMod,
      target: AttributeKey.reaction,
    })

    // Assert
    expect(modifiers).toEqual([
      { name: "Jazz", value: 1, overriddenBy: { name: "Kamikaze", value: 2, tag: "drug" } },
      { name: "Kamikaze", value: 2 },
      { name: "Wired Reflexes", value: 1 },
    ])
  })
})

describe.concurrent("RatingFormulas.getSkillRating with overridden modifiers", () => {
  it("leaves overridden modifiers out of the rating", () => {
    // Arrange
    const modifiers = [
      { name: "Jazz", value: 1, overriddenBy: { name: "Kamikaze", value: 2, tag: "drug" } },
      { name: "Kamikaze", value: 2 },
    ]

    // Act
    const breakdown = RatingFormulas.getSkillRating({ rawValue: 3, modifiers })

    // Assert
    expect(breakdown.rating).toBe(5)
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
      modifiers: [{ name: "Muscle Toner", value: 5 }, { name: "Augmented maximum", value: -2, isCap: true }],
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

describe.concurrent("RatingFormulas.getAttrRating with penalties", () => {
  it("applies penalties after the augmented maximum caps the modifiers", () => {
    // Arrange / Act
    const breakdown = RatingFormulas.getAttrRating({
      rawValue: 6,
      modifiers: [{ name: "Muscle Toner", value: 5 }],
      augmentedMax: 9,
      penalties: [{ name: "Encumbrance", value: -1 }],
    })

    // Assert
    expect(breakdown).toEqual({
      rawValue: 6,
      modifiers: [
        { name: "Muscle Toner", value: 5 },
        { name: "Augmented maximum", value: -2, isCap: true },
        { name: "Encumbrance", value: -1 },
      ],
      rating: 8,
    })
  })
})

describe.concurrent("RatingFormulas.getProgramRating", () => {
  it("caps the rating at the System limit, listing the cap as a modifier", () => {
    // Arrange
    const input = { rawValue: 5, systemLimit: 3 }

    // Act
    const breakdown = RatingFormulas.getProgramRating(input)

    // Assert
    expect(breakdown).toEqual({
      rawValue: 5,
      modifiers: [{ name: "System limit", value: -2, isCap: true }],
      rating: 3,
    })
  })

  it("leaves a rating within the System limit unchanged", () => {
    // Arrange
    const input = { rawValue: 3, systemLimit: 4 }

    // Act
    const breakdown = RatingFormulas.getProgramRating(input)

    // Assert
    expect(breakdown).toEqual({ rawValue: 3, modifiers: [], rating: 3 })
  })

  it("applies no cap when no System limit is given", () => {
    // Arrange
    const input = { rawValue: 6 }

    // Act
    const breakdown = RatingFormulas.getProgramRating(input)

    // Assert
    expect(breakdown).toEqual({ rawValue: 6, modifiers: [], rating: 6 })
  })
})
