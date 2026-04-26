import { describe, expect, it } from "vitest"

import { LocalStorageProvider } from "#/lib/storage/localStorage/localStorageProvider.ts"
import { MemoryStorage } from "#testUtils/storage/memoryStorage.ts"

interface ProviderWithStorage {
  getStorage: () => Storage
}

function makeProvider(prefix = "test"): { provider: LocalStorageProvider, storage: MemoryStorage } {
  const storage = new MemoryStorage()
  const provider = new LocalStorageProvider({ storagePrefix: prefix })
  // The provider expects `globalThis.localStorage`; swap in an in-memory fake.
  ;(provider as unknown as ProviderWithStorage).getStorage = () => storage
  return { provider, storage }
}

describe("LocalStorageProvider", () => {
  describe("providerId", () => {
    it("identifies itself as 'local-storage'", () => {
      // Arrange
      const { provider } = makeProvider()

      // Act / Assert
      expect(provider.providerId).toBe("local-storage")
    })
  })

  describe("saveJsonFile / loadJsonFile", () => {
    it("round-trips a value through storage", async () => {
      // Arrange
      const { provider } = makeProvider()
      const value = { hello: "world", count: 3 }

      // Act
      const saved = await provider.saveJsonFile("characters/abc.json", value)
      const loaded = await provider.loadJsonFile<typeof value>("characters/abc.json")

      // Assert
      expect(saved.value).toEqual(value)
      expect(loaded?.value).toEqual(value)
      expect(loaded?.path).toBe("characters/abc.json")
      expect(loaded?.updatedAt).toBe(saved.updatedAt)
    })

    it("returns null for an unknown path", async () => {
      // Arrange
      const { provider } = makeProvider()

      // Act
      const loaded = await provider.loadJsonFile("characters/missing.json")

      // Assert
      expect(loaded).toBeNull()
    })

    it("normalises leading slashes and backslashes in the stored path", async () => {
      // Arrange
      const { provider } = makeProvider()

      // Act
      const saved = await provider.saveJsonFile("\\characters\\abc.json", { ok: true })

      // Assert — backslashes converted, no leading slash
      expect(saved.path).toBe("characters/abc.json")
      const loadedNormalized = await provider.loadJsonFile<{ ok: boolean }>("characters/abc.json")
      expect(loadedNormalized?.value).toEqual({ ok: true })
    })

    it("strips leading forward slashes from the stored path", async () => {
      // Arrange
      const { provider } = makeProvider()

      // Act
      const saved = await provider.saveJsonFile("///a.json", { v: 1 })

      // Assert
      expect(saved.path).toBe("a.json")
    })

    it("overwrites an existing entry on save", async () => {
      // Arrange
      const { provider } = makeProvider()
      await provider.saveJsonFile("a.json", { v: 1 })

      // Act
      await provider.saveJsonFile("a.json", { v: 2 })
      const loaded = await provider.loadJsonFile<{ v: number }>("a.json")

      // Assert
      expect(loaded?.value).toEqual({ v: 2 })
    })

    it("stamps an ISO updatedAt on each save", async () => {
      // Arrange
      const { provider } = makeProvider()

      // Act
      const saved = await provider.saveJsonFile("a.json", {})

      // Assert
      expect(() => new Date(saved.updatedAt).toISOString()).not.toThrow()
      expect(saved.updatedAt).toBe(new Date(saved.updatedAt).toISOString())
    })
  })

  describe("listJsonFiles", () => {
    it("returns metadata for every saved file when no prefix is given", async () => {
      // Arrange
      const { provider } = makeProvider()
      await provider.saveJsonFile("characters/a.json", { id: "a" })
      await provider.saveJsonFile("characters/b.json", { id: "b" })
      await provider.saveJsonFile("settings.json", {})

      // Act
      const files = await provider.listJsonFiles()

      // Assert — sorted alphabetically by path
      expect(files.map((file) => file.path)).toEqual([
        "characters/a.json",
        "characters/b.json",
        "settings.json",
      ])
    })

    it("filters by path prefix", async () => {
      // Arrange
      const { provider } = makeProvider()
      await provider.saveJsonFile("characters/a.json", {})
      await provider.saveJsonFile("settings.json", {})

      // Act
      const files = await provider.listJsonFiles("characters/")

      // Assert
      expect(files.map((file) => file.path)).toEqual(["characters/a.json"])
    })

    it("ignores keys that do not belong to this provider's storage prefix", async () => {
      // Arrange — two providers with different prefixes share one underlying storage
      const sharedStorage = new MemoryStorage()
      const providerA = new LocalStorageProvider({ storagePrefix: "alpha" })
      const providerB = new LocalStorageProvider({ storagePrefix: "beta" })
      ;(providerA as unknown as ProviderWithStorage).getStorage = () => sharedStorage
      ;(providerB as unknown as ProviderWithStorage).getStorage = () => sharedStorage

      await providerA.saveJsonFile("a.json", { who: "alpha" })
      await providerB.saveJsonFile("b.json", { who: "beta" })

      // Act
      const filesForA = await providerA.listJsonFiles()
      const filesForB = await providerB.listJsonFiles()

      // Assert
      expect(filesForA.map((file) => file.path)).toEqual(["a.json"])
      expect(filesForB.map((file) => file.path)).toEqual(["b.json"])
    })
  })

  describe("deleteJsonFile", () => {
    it("removes the entry so subsequent loads return null", async () => {
      // Arrange
      const { provider } = makeProvider()
      await provider.saveJsonFile("a.json", { ok: true })

      // Act
      await provider.deleteJsonFile("a.json")
      const loaded = await provider.loadJsonFile("a.json")

      // Assert
      expect(loaded).toBeNull()
    })

    it("is a no-op on an unknown path", async () => {
      // Arrange
      const { provider } = makeProvider()

      // Act / Assert — should not throw
      await expect(provider.deleteJsonFile("does-not-exist.json")).resolves.toBeUndefined()
    })
  })
})
