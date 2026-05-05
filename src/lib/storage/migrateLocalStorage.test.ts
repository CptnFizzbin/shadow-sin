import { beforeEach, describe, expect, it } from "vitest"

import { migrateOldLocalStorageFormat } from "./migrateLocalStorage.ts"

// Simple in-memory Storage implementation for testing
function makeStorage(): Storage {
  const store = new Map<string, string>()

  const storage: Storage = {
    get length() {
      return store.size
    },
    key(index: number): string | null {
      return Array.from(store.keys())[index] ?? null
    },
    getItem(key: string): string | null {
      return store.get(key) ?? null
    },
    setItem(key: string, value: string): void {
      store.set(key, value)
    },
    removeItem(key: string): void {
      store.delete(key)
    },
    clear(): void {
      store.clear()
    },
  }

  return storage
}

describe("migrateOldLocalStorageFormat", () => {
  let ls: Storage

  beforeEach(() => {
    ls = makeStorage()
  })

  describe("character migration", () => {
    it("migrates an old envelope-wrapped character to the new flat format", () => {
      // Arrange
      const characterId = "abc-123"
      const characterData = { id: characterId, profile: { alias: "Blur" } }
      ls.setItem(
        `shadow-sin:json:characters/${characterId}.json`,
        JSON.stringify({ path: `characters/${characterId}.json`, updatedAt: "2025-01-01", value: characterData }),
      )

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      const migrated = ls.getItem(`shadowsin:characters/${characterId}`)
      expect(migrated).not.toBeNull()
      expect(JSON.parse(migrated!)).toEqual(characterData)
    })

    it("removes the old character key after migration", () => {
      // Arrange
      const characterId = "abc-123"
      ls.setItem(
        `shadow-sin:json:characters/${characterId}.json`,
        JSON.stringify({ value: { id: characterId } }),
      )

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      expect(ls.getItem(`shadow-sin:json:characters/${characterId}.json`)).toBeNull()
    })

    it("does not overwrite a character that was already migrated to the new format", () => {
      // Arrange
      const characterId = "abc-123"
      const existingData = { id: characterId, profile: { alias: "AlreadyMigrated" } }
      ls.setItem(`shadowsin:characters/${characterId}`, JSON.stringify(existingData))
      ls.setItem(
        `shadow-sin:json:characters/${characterId}.json`,
        JSON.stringify({ value: { id: characterId, profile: { alias: "OldData" } } }),
      )

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert — existing new-format key is preserved
      const stored = JSON.parse(ls.getItem(`shadowsin:characters/${characterId}`)!) as Record<string, unknown>
      expect((stored["profile"] as Record<string, unknown>)["alias"]).toBe("AlreadyMigrated")
    })

    it("handles a character whose value is at the envelope root (no .value wrapper)", () => {
      // Arrange — old key contained the character directly with no envelope
      const characterId = "abc-456"
      const characterData = { id: characterId, profile: { alias: "NoEnvelope" } }
      ls.setItem(`shadow-sin:json:characters/${characterId}.json`, JSON.stringify(characterData))

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      const migrated = ls.getItem(`shadowsin:characters/${characterId}`)
      expect(JSON.parse(migrated!)).toEqual(characterData)
    })

    it("skips unparseable character entries without removing them", () => {
      // Arrange
      const characterId = "bad-id"
      ls.setItem(`shadow-sin:json:characters/${characterId}.json`, "not valid json{{{")

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert — bad key is left untouched (data-safe)
      expect(ls.getItem(`shadow-sin:json:characters/${characterId}.json`)).toBe("not valid json{{{")
      expect(ls.getItem(`shadowsin:characters/${characterId}`)).toBeNull()
    })
  })

  describe("builder state migration", () => {
    it("migrates an old builder draft to the new path", () => {
      // Arrange
      const characterId = "abc-123"
      const builderState = { character: { id: characterId }, builder: { startingNuyen: 5000 } }
      ls.setItem(`shadow-sin:character-form:${characterId}`, JSON.stringify(builderState))

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      const migrated = ls.getItem(`shadowsin:builder/character-form/${characterId}`)
      expect(migrated).not.toBeNull()
      expect(JSON.parse(migrated!)).toEqual(builderState)
    })

    it("removes the old builder key after migration", () => {
      // Arrange
      const characterId = "abc-123"
      ls.setItem(`shadow-sin:character-form:${characterId}`, JSON.stringify({}))

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      expect(ls.getItem(`shadow-sin:character-form:${characterId}`)).toBeNull()
    })

    it("does not overwrite a builder draft that was already migrated", () => {
      // Arrange
      const characterId = "abc-123"
      const existing = JSON.stringify({ character: { id: characterId }, builder: { startingNuyen: 9999 } })
      ls.setItem(`shadowsin:builder/character-form/${characterId}`, existing)
      ls.setItem(`shadow-sin:character-form:${characterId}`, JSON.stringify({ character: { id: characterId }, builder: { startingNuyen: 1 } }))

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert — new-format key is untouched
      expect(ls.getItem(`shadowsin:builder/character-form/${characterId}`)).toBe(existing)
    })
  })

  describe("index rebuild", () => {
    it("creates an index entry from the migrated character's alias", () => {
      // Arrange
      const characterId = "abc-123"
      const characterData = { id: characterId, profile: { alias: "Blur" } }
      ls.setItem(
        `shadow-sin:json:characters/${characterId}.json`,
        JSON.stringify({ value: characterData }),
      )

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      const index = JSON.parse(ls.getItem("shadowsin:index")!) as Array<{ id: string, name: string }>
      expect(index).toHaveLength(1)
      expect(index[0].id).toBe(characterId)
      expect(index[0].name).toBe("Blur")
    })

    it("uses the character id as the name when no profile.alias is present", () => {
      // Arrange
      const characterId = "abc-999"
      ls.setItem(
        `shadow-sin:json:characters/${characterId}.json`,
        JSON.stringify({ value: { id: characterId } }),
      )

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      const index = JSON.parse(ls.getItem("shadowsin:index")!) as Array<{ id: string, name: string }>
      expect(index[0].name).toBe(characterId)
    })

    it("appends to an existing index without duplicating already-indexed characters", () => {
      // Arrange
      const existingId = "existing-char"
      ls.setItem("shadowsin:index", JSON.stringify([{ id: existingId, name: "Existing", lastModified: "2024-01-01T00:00:00.000Z" }]))
      const newId = "new-char"
      ls.setItem(
        `shadow-sin:json:characters/${newId}.json`,
        JSON.stringify({ value: { id: newId, profile: { alias: "NewGuy" } } }),
      )

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      const index = JSON.parse(ls.getItem("shadowsin:index")!) as Array<{ id: string }>
      expect(index).toHaveLength(2)
      expect(index.map((e) => e.id)).toContain(existingId)
      expect(index.map((e) => e.id)).toContain(newId)
    })

    it("does not create an index when only builder state is migrated (no characters)", () => {
      // Arrange
      ls.setItem(`shadow-sin:character-form:abc-123`, JSON.stringify({}))

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert — no character migration means no index update
      expect(ls.getItem("shadowsin:index")).toBeNull()
    })
  })

  describe("idempotency", () => {
    it("is idempotent — running twice produces the same result", () => {
      // Arrange
      const characterId = "abc-123"
      const characterData = { id: characterId, profile: { alias: "Blur" } }
      ls.setItem(
        `shadow-sin:json:characters/${characterId}.json`,
        JSON.stringify({ value: characterData }),
      )

      // Act
      migrateOldLocalStorageFormat(ls)
      migrateOldLocalStorageFormat(ls)

      // Assert — old key is gone, new key still has the correct data
      expect(ls.getItem(`shadow-sin:json:characters/${characterId}.json`)).toBeNull()
      expect(JSON.parse(ls.getItem(`shadowsin:characters/${characterId}`)!)).toEqual(characterData)

      const index = JSON.parse(ls.getItem("shadowsin:index")!) as Array<{ id: string }>
      expect(index).toHaveLength(1)
    })
  })

  describe("no-op when storage is empty", () => {
    it("does nothing when there are no old-format keys", () => {
      // Arrange — storage already empty

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert — nothing written
      expect(ls.length).toBe(0)
    })

    it("does not touch unrelated keys", () => {
      // Arrange
      ls.setItem("some-other-app:data", "untouched")

      // Act
      migrateOldLocalStorageFormat(ls)

      // Assert
      expect(ls.getItem("some-other-app:data")).toBe("untouched")
      expect(ls.length).toBe(1)
    })
  })
})
