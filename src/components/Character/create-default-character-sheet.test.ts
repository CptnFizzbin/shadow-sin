import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/lib/system/attribute-key.ts"
import { AwakeningType } from "#/lib/system/awakening-type.ts"
import { LifestyleType } from "#/lib/system/lifestyle-type.ts"
import { MetatypeType } from "#/lib/system/metatype-data.ts"
import { CurrentCharacterSheetVersion } from "#/lib/storage/characters/current-character-sheet-version.ts"

import { createDefaultCharacterSheet, NULL_CHARACTER_ID } from "#/components/Character/create-default-character-sheet.ts"

describe("NULL_CHARACTER_ID", () => {
  it("is the nil UUID", () => {
    expect(NULL_CHARACTER_ID).toBe("00000000-0000-0000-0000-000000000000")
  })
})

describe("createDefaultCharacterSheet", () => {
  it("returns a character sheet with the null character id", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.id).toBe(NULL_CHARACTER_ID)
  })

  it("returns a character sheet with the current version", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.version).toBe(CurrentCharacterSheetVersion)
  })

  it("sets default biology to Human Mundane", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.biology.metatype).toBe(MetatypeType.Human)
    expect(sheet.biology.awakening).toBe(AwakeningType.Mundane)
  })

  it("leaves optional biology fields undefined", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.biology.gender).toBeUndefined()
    expect(sheet.biology.age).toBeUndefined()
    expect(sheet.biology.weight).toBeUndefined()
    expect(sheet.biology.height).toBeUndefined()
  })

  it("sets default profile to empty strings and zero reputation", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.profile.alias).toBe("")
    expect(sheet.profile.name).toBe("")
    expect(sheet.profile.archetype).toBe("")
    expect(sheet.profile.streetCred).toBe(0)
    expect(sheet.profile.notoriety).toBe(0)
    expect(sheet.profile.description).toBe("")
    expect(sheet.profile.personality).toBe("")
  })

  it("sets default lifestyle to Middle quality", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.profile.lifestyle?.quality).toBe(LifestyleType.Middle)
    expect(sheet.profile.lifestyle?.monthsPaid).toBe(1)
  })

  it("initializes all attribute keys with valid values", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    for (const key of Object.values(AttributeKey)) {
      expect(typeof sheet.attributes[key]).toBe("number")
    }
  })

  it("sets essence attribute to 6 by default", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.attributes[AttributeKey.essence]).toBe(6)
  })

  it("sets magic attribute to 0 for Mundane default", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.attributes[AttributeKey.magic]).toBe(0)
  })

  it("sets resonance attribute to 0 for Mundane default", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.attributes[AttributeKey.resonance]).toBe(0)
  })

  it("initializes empty collections for gear, spells, adeptPowers, etc.", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.spells).toEqual([])
    expect(sheet.adeptPowers).toEqual([])
    expect(sheet.complexForms).toEqual([])
    expect(sheet.sprites).toEqual([])
    expect(sheet.contacts).toEqual([])
    expect(sheet.qualities).toEqual([])
    expect(sheet.gear).toEqual({})
  })

  it("initializes empty skills structure", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.skills.activeSkills).toEqual([])
    expect(sheet.skills.skillGroups).toEqual([])
    expect(sheet.skills.knowledgeSkills).toEqual([])
    expect(sheet.skills.languageSkills).toEqual([])
  })

  it("initializes karma with zero values", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.karma.total).toBe(0)
    expect(sheet.karma.current).toBe(0)
  })

  it("initializes nuyen with zero current and empty loans", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.nuyen.current).toBe(0)
    expect(sheet.nuyen.loans).toEqual([])
  })

  it("initializes damage with zero values", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.damage.physical).toBe(0)
    expect(sheet.damage.stun).toBe(0)
    expect(sheet.damage.matrix).toBe(0)
  })

  it("initializes edge tracking with zero current edge", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert
    expect(sheet.edge.current).toBe(0)
  })

  it("returns a new independent object on each call", () => {
    // Arrange / Act
    const sheet1 = createDefaultCharacterSheet()
    const sheet2 = createDefaultCharacterSheet()

    // Mutate one
    sheet1.profile.alias = "Ghost"

    // Assert that the other is unaffected
    expect(sheet2.profile.alias).toBe("")
  })

  it("human body attribute is clamped to the human minimum of 1", () => {
    // Arrange / Act
    const sheet = createDefaultCharacterSheet()

    // Assert - human body min is 1, default value (undefined) clamps up to min
    expect(sheet.attributes[AttributeKey.body]).toBeGreaterThanOrEqual(1)
  })
})