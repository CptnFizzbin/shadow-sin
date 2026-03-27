import { beforeEach, describe, expect, it, vi } from "vitest"

import type { IStorageProvider } from "#/lib/storage/IStorageProvider.ts"
import { StorageManager } from "#/lib/storage/StorageManager.ts"
import { CharacterManager } from "#/lib/storage/characters/CharacterManager.ts"
import type { PlayerCharacterData } from "#/lib/system/playerCharacterData.ts"

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeCharacter(
  overrides: Partial<PlayerCharacterData> & { id: string },
): PlayerCharacterData {
  return {
    version: 0,
    profile: {
      alias: overrides.profile?.alias ?? "Alias",
      name: overrides.profile?.name ?? "Name",
      streetCred: 0,
      notoriety: 0,
    },
    biology: {
      metatype: "human" as PlayerCharacterData["biology"]["metatype"],
      awakening: "Mundane" as PlayerCharacterData["biology"]["awakening"],
    },
    karma: { total: 0, current: 0 },
    nuyen: { current: 0, loans: [] },
    attributes: {} as PlayerCharacterData["attributes"],
    edge: { current: 3 },
    damage: { physical: 0, stun: 0, matrix: 0 },
    gear: {},
    skills: {},
    qualities: [],
    contacts: [],
    ...overrides,
  }
}

function makeStoredFile<TValue>(value: TValue) {
  return {
    path: "characters/test.json",
    updatedAt: new Date().toISOString(),
    value,
  }
}

function makeProvider(
  overrides: Partial<IStorageProvider> = {},
): IStorageProvider {
  return {
    providerId: "mock-provider",
    listJsonFiles: vi.fn().mockResolvedValue([]),
    loadJsonFile: vi.fn().mockResolvedValue(null),
    saveJsonFile: vi.fn().mockImplementation((_path: string, value: unknown) =>
      Promise.resolve(makeStoredFile(value)),
    ),
    deleteJsonFile: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("CharacterManager", () => {
  let provider: IStorageProvider
  let manager: CharacterManager

  beforeEach(() => {
    provider = makeProvider()
    manager = new CharacterManager(new StorageManager(provider))
  })

  // ─── getCharacter ──────────────────────────────────────────────────────────

  describe("getCharacter", () => {
    it("returns null when the character does not exist", async () => {
      const result = await manager.getCharacter("unknown-id")
      expect(result).toBeNull()
    })

    it("loads a character from the expected path", async () => {
      const character = makeCharacter({ id: "char-1" })
      vi.mocked(provider.loadJsonFile).mockResolvedValueOnce(
        makeStoredFile(character),
      )

      const result = await manager.getCharacter("char-1")

      expect(provider.loadJsonFile).toHaveBeenCalledWith(
        "characters/char-1.json",
      )
      expect(result).toEqual(character)
    })
  })

  // ─── saveCharacter ─────────────────────────────────────────────────────────

  describe("saveCharacter", () => {
    it("persists a character to the expected path", async () => {
      const character = makeCharacter({ id: "char-save" })

      const result = await manager.saveCharacter(character)

      expect(provider.saveJsonFile).toHaveBeenCalledWith(
        "characters/char-save.json",
        character,
      )
      expect(result.value).toEqual(character)
    })
  })

  // ─── deleteCharacter ───────────────────────────────────────────────────────

  describe("deleteCharacter", () => {
    it("deletes the character file at the expected path", async () => {
      await manager.deleteCharacter("char-delete")

      expect(provider.deleteJsonFile).toHaveBeenCalledWith(
        "characters/char-delete.json",
      )
    })
  })

  // ─── listCharacters ────────────────────────────────────────────────────────

  describe("listCharacters", () => {
    it("returns an empty record when no character files exist", async () => {
      const result = await manager.listCharacters()
      expect(result).toEqual({})
    })

    it("returns all characters keyed by id", async () => {
      const zara = makeCharacter({ id: "zara", profile: { alias: "Zara", name: "Z", streetCred: 0, notoriety: 0 } })
      const anna = makeCharacter({ id: "anna", profile: { alias: "Anna", name: "A", streetCred: 0, notoriety: 0 } })
      const miri = makeCharacter({ id: "miri", profile: { alias: "Miri", name: "M", streetCred: 0, notoriety: 0 } })

      vi.mocked(provider.listJsonFiles).mockResolvedValueOnce([
        { path: "characters/zara.json", updatedAt: "" },
        { path: "characters/anna.json", updatedAt: "" },
        { path: "characters/miri.json", updatedAt: "" },
      ])

      vi.mocked(provider.loadJsonFile)
        .mockResolvedValueOnce(makeStoredFile(zara))
        .mockResolvedValueOnce(makeStoredFile(anna))
        .mockResolvedValueOnce(makeStoredFile(miri))

      const result = await manager.listCharacters()

      expect(Object.keys(result)).toHaveLength(3)
      expect(result["zara"].profile.alias).toBe("Zara")
      expect(result["anna"].profile.alias).toBe("Anna")
      expect(result["miri"].profile.alias).toBe("Miri")
    })

    it("excludes characters that fail to load (null)", async () => {
      vi.mocked(provider.listJsonFiles).mockResolvedValueOnce([
        { path: "characters/good.json", updatedAt: "" },
        { path: "characters/bad.json", updatedAt: "" },
      ])

      const goodCharacter = makeCharacter({ id: "good", profile: { alias: "Good", name: "G", streetCred: 0, notoriety: 0 } })
      vi.mocked(provider.loadJsonFile)
        .mockResolvedValueOnce(makeStoredFile(goodCharacter))
        .mockResolvedValueOnce(null)

      const result = await manager.listCharacters()

      expect(Object.keys(result)).toHaveLength(1)
      expect(result["good"].id).toBe("good")
    })
  })

  // ─── ensureCharacters ──────────────────────────────────────────────────────

  describe("ensureCharacters", () => {
    it("saves a character that does not yet exist in storage", async () => {
      const character = makeCharacter({ id: "new-char" })

      // getCharacter returns null → character does not exist
      vi.mocked(provider.loadJsonFile)
        .mockResolvedValueOnce(null) // getCharacter check
        .mockResolvedValueOnce(null) // listCharacters loadJsonFile call (empty)

      vi.mocked(provider.listJsonFiles)
        .mockResolvedValueOnce([]) // listCharacters

      await manager.ensureCharacters([character])

      expect(provider.saveJsonFile).toHaveBeenCalledWith(
        "characters/new-char.json",
        character,
      )
    })

    it("skips saving a character that already exists in storage", async () => {
      const character = makeCharacter({ id: "existing" })

      // getCharacter returns existing character → skip save
      vi.mocked(provider.loadJsonFile)
        .mockResolvedValueOnce(makeStoredFile(character)) // getCharacter check
        .mockResolvedValueOnce(makeStoredFile(character)) // listCharacters

      vi.mocked(provider.listJsonFiles).mockResolvedValueOnce([
        { path: "characters/existing.json", updatedAt: "" },
      ])

      await manager.ensureCharacters([character])

      expect(provider.saveJsonFile).not.toHaveBeenCalled()
    })
  })

  // ─── migrateCharacter ──────────────────────────────────────────────────────

  describe("migration", () => {
    it("applies a pending migration to a character with an older version", async () => {
      // Arrange: character at version 0; a migration exists for version 1
      const oldCharacter = makeCharacter({ id: "migrant", version: 0 })

      // We need to inject a migration at runtime. Import the migrations array
      // and temporarily add a test migration for this test only.
      const migrationsModule = await import(
        "#/lib/storage/characters/migrations/index.ts",
      )
      const testMigration = {
        version: 1,
        up: vi.fn().mockImplementation((c: typeof oldCharacter) =>
          Promise.resolve({
            ...c,
            migrated: true,
          }),
        ),
      }
      migrationsModule.migrations.push(testMigration)

      vi.mocked(provider.loadJsonFile).mockResolvedValueOnce(
        makeStoredFile(oldCharacter),
      )

      const result = await manager.getCharacter("migrant")

      // Cleanup: remove the injected migration
      const idx = migrationsModule.migrations.indexOf(testMigration)
      if (idx !== -1) migrationsModule.migrations.splice(idx, 1)

      expect(testMigration.up).toHaveBeenCalledOnce()
      expect((result as unknown as Record<string, unknown>)["migrated"]).toBe(
        true,
      )
      // The migrated character should be auto-saved
      expect(provider.saveJsonFile).toHaveBeenCalledOnce()
    })

    it("does not re-save a character that requires no migration", async () => {
      const currentCharacter = makeCharacter({ id: "no-migrate", version: 0 })

      vi.mocked(provider.loadJsonFile).mockResolvedValueOnce(
        makeStoredFile(currentCharacter),
      )

      await manager.getCharacter("no-migrate")

      expect(provider.saveJsonFile).not.toHaveBeenCalled()
    })
  })
})
