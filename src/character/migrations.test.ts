import { beforeEach, describe, expect, it } from "vitest"

import { characterSheetToYaml, yamlToCharacterSheet } from "#/components/character/exportImport/exportUtils.ts"
import type { LocalStorageProvider } from "#/lib/storage/localStorage/localStorageProvider.ts"
import BlurYaml from "#testUtils/fixtures/characters/blur.yaml?raw"
import {
  characterV0,
  characterV1,
  TEST_CHARACTER_ID,
  TEST_LOAN_ID,
  TEST_OLD_FORMAT_CHARACTER_ID,
  TEST_OLD_FORMAT_LICENSE_ID,
  TEST_OLD_FORMAT_SIN_ID,
} from "#testUtils/fixtures/characters/characterSheets.ts"
import { makeTestCharacterManager } from "#testUtils/storage/makeTestCharacterManager.ts"

import type { CharacterManager } from "./characterManager.ts"

describe("character migrations + yaml round-trip", () => {
  let manager: CharacterManager
  let provider: LocalStorageProvider

  beforeEach(async () => {
    ;({ manager, provider } = makeTestCharacterManager())
    await provider.saveJsonFile(
      `characters/${TEST_CHARACTER_ID}.json`,
      characterV1,
    )
  })

  it("applies all migrations to a pre-migration character", async () => {
    // Arrange — character already saved in beforeEach

    // Act
    const migrated = await manager.getCharacter(TEST_CHARACTER_ID)

    // Assert
    expect(migrated).not.toBeNull()
    expect(migrated!._meta_.appliedMigrations).toContain("20250101")
    expect(migrated!._meta_.appliedMigrations).toContain("20250801")
    expect(migrated!._meta_.appliedMigrations).toContain("20251001")
    expect(migrated!._meta_.appliedMigrations).toContain("20260416")
    expect(migrated!._meta_.appliedMigrations).toContain("20260417")
    expect(migrated!._meta_.appliedMigrations).toContain("20260418")
    expect(migrated!._meta_.appliedMigrations).toContain("20260419")
    expect(migrated!._meta_.appliedMigrations).toContain("20260423")
    expect("version" in (migrated! as object)).toBe(false)
  })

  it("does not re-run migrations already in appliedMigrations", async () => {
    // Arrange — characterPost20260418 has 20250801–20260418 applied and a
    // loan with a known stable ID; only 20260419 should run
    const { manager: freshManager, provider: freshProvider } = makeTestCharacterManager()
    await freshProvider.saveJsonFile(
      `characters/${TEST_CHARACTER_ID}.json`,
      characterV1,
    )

    // Act
    const migrated = await freshManager.getCharacter(TEST_CHARACTER_ID)

    // Assert — loan ID unchanged (20251001 was NOT re-run)
    expect(migrated).not.toBeNull()
    expect(migrated!.nuyen.loans[0]?.id).toBe(TEST_LOAN_ID)
    expect(migrated!._meta_.appliedMigrations).toContain("20260419")
  })

  it("yaml export/import round-trips a fully migrated character", async () => {
    // Arrange — migrate the pre-migration character
    const migrated = await manager.getCharacter(TEST_CHARACTER_ID)
    expect(migrated).not.toBeNull()

    // Act
    const yaml = characterSheetToYaml(migrated!)
    const restored = yamlToCharacterSheet(yaml)

    // Assert — scalar fields survive the round-trip
    expect(restored.id).toBe(migrated!.id)
    expect(restored._meta_).toEqual(migrated!._meta_)
    expect(restored.nuyen).toEqual(migrated!.nuyen)
    expect(restored.spells).toEqual(migrated!.spells)
  })

  it("yaml-imported character has all migration IDs already applied", async () => {
    // Arrange — migrate then export/import
    const migrated = await manager.getCharacter(TEST_CHARACTER_ID)
    const yaml = characterSheetToYaml(migrated!)
    const restored = yamlToCharacterSheet(yaml)

    // Save the restored (already-migrated) character into fresh storage
    const { manager: freshManager, provider: freshProvider } = makeTestCharacterManager()
    await freshProvider.saveJsonFile(`characters/${restored.id}.json`, restored)

    // Act — loading should not re-run any migrations
    const reloaded = await freshManager.getCharacter(restored.id)

    // Assert
    expect(reloaded).not.toBeNull()
    expect(reloaded!._meta_.appliedMigrations).toEqual(migrated!._meta_.appliedMigrations)
  })

  it("normalises an old-format character into the current CharacterSheet shape", async () => {
    // Arrange — save the old-format character into fresh storage
    const { manager: freshManager, provider: freshProvider } = makeTestCharacterManager()
    await freshProvider.saveJsonFile(
      `characters/${TEST_OLD_FORMAT_CHARACTER_ID}.json`,
      characterV0,
    )

    // Act
    const migrated = await freshManager.getCharacter(TEST_OLD_FORMAT_CHARACTER_ID)

    // Assert — character loaded without error
    expect(migrated).not.toBeNull()

    // id migrated from characterId
    expect(migrated!.id).toBe(TEST_OLD_FORMAT_CHARACTER_ID)

    // profile/biology populated from flat fields
    expect(migrated!.profile.alias).toBe("Blur")
    expect(migrated!.profile.name).toBe("Long")
    expect(migrated!.profile.lifestyle).toEqual({ quality: "Low", monthsPaid: 3 })
    expect(migrated!.biology.metatype).toBe("Human")
    expect(migrated!.biology.awakening).toBe("Mystic Adept")
    expect(migrated!.biology.age).toBe(0)

    // attributes are flat numbers
    expect(migrated!.attributes.body).toBe(4)
    expect(migrated!.attributes.agility).toBe(5)
    expect(migrated!.attributes.magic).toBe(5)
    expect(migrated!.attributes.essence).toBe(6)

    // skill groups use `name` instead of `groupName`
    expect(migrated!.skills.skillGroups).toHaveLength(1)
    expect(migrated!.skills.skillGroups[0].name).toBe("Athletics")
    expect(migrated!.skills.skillGroups[0].rating).toBe(2)

    // native language skill uses `"native"` rating
    const english = migrated!.skills.languageSkills.find((s) => s.name === "English")
    expect(english?.rating).toBe("native")
    const sylvan = migrated!.skills.languageSkills.find((s) => s.name === "Sylvan")
    expect(sylvan?.rating).toBe(4)

    // spells promoted from awakened to top-level
    expect(migrated!.spells).toHaveLength(2)
    expect(migrated!.adeptPowers).toHaveLength(4)
    expect(migrated!.complexForms).toHaveLength(0)

    // gear is a Record, empty items stripped, itemTypes normalised
    const gearValues = Object.values(migrated!.gear)
    const weapon = gearValues.find((item) => item.name === "SM-4")
    expect(weapon?.itemType).toBe("weapon")
    const device = gearValues.find((item) => item.name === "Contact Lenses 3")
    expect(device?.itemType).toBe("device")
    const other = gearValues.find((item) => item.name === "Power Foci 2")
    expect(other?.itemType).toBe("other")
    const vehicle = gearValues.find((item) => item.name === "Indian Pathfinder")
    expect(vehicle?.itemType).toBe("vehicle")

    // license linked to SIN via parentId
    const sin = migrated!.gear[TEST_OLD_FORMAT_SIN_ID]
    expect(sin).toBeDefined()
    expect(sin.itemType).toBe("sin")
    const license = migrated!.gear[TEST_OLD_FORMAT_LICENSE_ID]
    expect(license).toBeDefined()
    expect(license.itemType).toBe("license")
    expect(license.parentId).toBe(TEST_OLD_FORMAT_SIN_ID)
    expect(sin.childIds).toContain(TEST_OLD_FORMAT_LICENSE_ID)

    // migration ID recorded
    expect(migrated!._meta_.appliedMigrations).toContain("20250101")
  })

  it("imports blur.yaml (v0 export) via yamlToCharacterSheet into a valid CharacterSheet", () => {
    // Act
    const character = yamlToCharacterSheet(BlurYaml)

    // Assert — top-level CharacterSheet fields
    expect(character.id).toBe("00000000-0000-0000-0000-000000000000")
    expect(character.profile.alias).toBe("Blur")
    expect(character.profile.name).toBe("Long")
    expect(character.profile.lifestyle).toEqual({ quality: "Low", monthsPaid: 3 })
    expect(character.biology.metatype).toBe("Human")
    expect(character.biology.awakening).toBe("Mystic Adept")

    // attributes are flat numbers
    expect(character.attributes.body).toBe(4)
    expect(character.attributes.agility).toBe(5)
    expect(character.attributes.magic).toBe(5)

    // skills migrated
    expect(character.skills.skillGroups).toHaveLength(1)
    expect(character.skills.skillGroups[0].name).toBe("Athletics")
    const english = character.skills.languageSkills.find((s) => s.name === "English")
    expect(english?.rating).toBe("native")

    // spells promoted from awakened wrapper
    expect(character.spells).toHaveLength(2)
    expect(character.adeptPowers).toHaveLength(4)

    // gear is a Record, empty entries stripped, itemTypes normalised
    const gearValues = Object.values(character.gear)
    expect(gearValues.find((item) => item.name === "SM-4")?.itemType).toBe("weapon")
    expect(gearValues.find((item) => item.name === "Contact Lenses 3")?.itemType).toBe("device")
    expect(gearValues.find((item) => item.name === "Power Foci 2")?.itemType).toBe("other")

    // license linked to its parent SIN
    const sin = gearValues.find((item) => item.itemType === "sin")
    const license = gearValues.find((item) => item.itemType === "license")
    expect(sin).toBeDefined()
    expect(license).toBeDefined()
    expect(license!.parentId).toBe(sin!.id)
    expect(sin!.childIds).toContain(license!.id)

    // migrations applied
    expect(character._meta_.appliedMigrations).toContain("20250101")
  })
})
