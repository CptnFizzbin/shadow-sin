import { beforeEach, describe, expect, it } from "vitest"

import {
  characterSheetToYaml,
  yamlToCharacterSheet,
} from "#/components/character/exportUtils.ts"
import { CharacterManager } from "#/lib/storage/characters/characterManager.ts"
import { LocalStorageProvider } from "#/lib/storage/localStorage/localStorageProvider.ts"
import { StorageManager } from "#/lib/storage/storageManager.ts"
import {
  TEST_CHARACTER_ID,
  TEST_LOAN_ID,
  characterPost20260418,
  characterPreAllMigrations,
} from "#testUtils/characters/characterVersionFixtures.ts"
import { MemoryStorage } from "#testUtils/storage/memoryStorage.ts"

function makeManager(): {
  manager: CharacterManager
  provider: LocalStorageProvider
} {
  const memStorage = new MemoryStorage()
  const provider = new LocalStorageProvider({ storagePrefix: "test" })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(provider as any).getStorage = () => memStorage

  return { manager: new CharacterManager(new StorageManager(provider)), provider }
}

describe("character migrations + yaml round-trip", () => {
  let manager: CharacterManager
  let provider: LocalStorageProvider

  beforeEach(async () => {
    const result = makeManager()
    manager = result.manager
    provider = result.provider
    await provider.saveJsonFile(
      `characters/${TEST_CHARACTER_ID}.json`,
      characterPreAllMigrations,
    )
  })

  it("applies all migrations to a pre-migration character", async () => {
    // Arrange — character already saved in beforeEach

    // Act
    const migrated = await manager.getCharacter(TEST_CHARACTER_ID)

    // Assert
    expect(migrated).not.toBeNull()
    expect(migrated!._meta_.appliedMigrations).toContain("20250801")
    expect(migrated!._meta_.appliedMigrations).toContain("20251001")
    expect(migrated!._meta_.appliedMigrations).toContain("20260416")
    expect(migrated!._meta_.appliedMigrations).toContain("20260417")
    expect(migrated!._meta_.appliedMigrations).toContain("20260418")
    expect(migrated!._meta_.appliedMigrations).toContain("20260419")
    expect("version" in (migrated! as object)).toBe(false)
  })

  it("does not re-run migrations already in appliedMigrations", async () => {
    // Arrange — characterPost20260418 has 20250801–20260418 applied and a
    // loan with a known stable ID; only 20260419 should run
    const { manager: freshManager, provider: freshProvider } = makeManager()
    await freshProvider.saveJsonFile(
      `characters/${TEST_CHARACTER_ID}.json`,
      characterPost20260418,
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
    const { manager: freshManager, provider: freshProvider } = makeManager()
    await freshProvider.saveJsonFile(`characters/${restored.id}.json`, restored)

    // Act — loading should not re-run any migrations
    const reloaded = await freshManager.getCharacter(restored.id)

    // Assert
    expect(reloaded).not.toBeNull()
    expect(reloaded!._meta_.appliedMigrations).toEqual(migrated!._meta_.appliedMigrations)
  })
})
