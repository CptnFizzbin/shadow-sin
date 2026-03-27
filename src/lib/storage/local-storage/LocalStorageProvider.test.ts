import { beforeEach, describe, expect, it } from "vitest"

import { LocalStorageProvider } from "#/lib/storage/local-storage/LocalStorageProvider.ts"
import { MemoryStorage } from "#test-utils/storage/MemoryStorage.ts"

describe("LocalStorageProvider", () => {
  let storage: Storage

  const makeProvider = (prefix = "test") =>
    new LocalStorageProvider({ storage, storagePrefix: prefix })

  beforeEach(() => {
    storage = new MemoryStorage()
  })

  describe("providerId", () => {
    it("exposes a stable provider identifier", () => {
      expect(makeProvider().providerId).toBe("local-storage")
    })
  })

  describe("saveJsonFile / loadJsonFile round-trip", () => {
    it("persists and retrieves a JSON value by path", async () => {
      const provider = makeProvider()
      const payload = { name: "Neo", health: 100 }

      await provider.saveJsonFile("characters/neo.json", payload)
      const loaded = await provider.loadJsonFile<typeof payload>(
        "characters/neo.json",
      )

      expect(loaded).not.toBeNull()
      expect(loaded!.path).toBe("characters/neo.json")
      expect(loaded!.value).toEqual(payload)
    })

    it("stores an ISO-8601 updatedAt timestamp", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("foo.json", { x: 1 })
      const loaded = await provider.loadJsonFile("foo.json")

      expect(loaded!.updatedAt).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/,
      )
    })

    it("overwrites an existing file when saved again", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("item.json", { value: 1 })
      await provider.saveJsonFile("item.json", { value: 2 })
      const loaded = await provider.loadJsonFile<{ value: number }>("item.json")

      expect(loaded!.value).toEqual({ value: 2 })
    })
  })

  describe("loadJsonFile", () => {
    it("returns null for a path that has not been saved", async () => {
      const result = await makeProvider().loadJsonFile("missing.json")
      expect(result).toBeNull()
    })
  })

  describe("deleteJsonFile", () => {
    it("removes a previously saved file", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("to-delete.json", { bye: true })
      await provider.deleteJsonFile("to-delete.json")

      const loaded = await provider.loadJsonFile("to-delete.json")
      expect(loaded).toBeNull()
    })

    it("does not throw when deleting a non-existent path", async () => {
      await expect(
        makeProvider().deleteJsonFile("ghost.json"),
      ).resolves.toBeUndefined()
    })
  })

  describe("listJsonFiles", () => {
    it("returns an empty array when storage contains no matching entries", async () => {
      const files = await makeProvider().listJsonFiles()
      expect(files).toEqual([])
    })

    it("lists all saved files sorted by path", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("b.json", {})
      await provider.saveJsonFile("a.json", {})
      await provider.saveJsonFile("c.json", {})

      const files = await provider.listJsonFiles()
      expect(files.map((f) => f.path)).toEqual(["a.json", "b.json", "c.json"])
    })

    it("filters results by path prefix when provided", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("characters/neo.json", {})
      await provider.saveJsonFile("characters/trinity.json", {})
      await provider.saveJsonFile("settings/config.json", {})

      const characterFiles = await provider.listJsonFiles("characters")
      expect(characterFiles).toHaveLength(2)
      expect(characterFiles.every((f) => f.path.startsWith("characters"))).toBe(
        true,
      )
    })

    it("returns only metadata (path + updatedAt), not the value", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("meta-check.json", { secret: "data" })

      const files = await provider.listJsonFiles()
      expect(files[0]).toHaveProperty("path")
      expect(files[0]).toHaveProperty("updatedAt")
      expect(files[0]).not.toHaveProperty("value")
    })
  })

  describe("path normalization", () => {
    it("normalizes backslashes to forward slashes", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("characters\\neo.json", { ok: true })

      const loaded = await provider.loadJsonFile("characters/neo.json")
      expect(loaded).not.toBeNull()
      expect(loaded!.path).toBe("characters/neo.json")
    })

    it("strips leading slashes from paths", async () => {
      const provider = makeProvider()
      await provider.saveJsonFile("/leading-slash.json", { ok: true })

      const loaded = await provider.loadJsonFile("leading-slash.json")
      expect(loaded).not.toBeNull()
      expect(loaded!.path).toBe("leading-slash.json")
    })
  })

  describe("storage key prefixing", () => {
    it("providers with different prefixes do not share entries", async () => {
      const providerA = makeProvider("prefix-a")
      const providerB = makeProvider("prefix-b")

      await providerA.saveJsonFile("shared.json", { source: "A" })

      const resultFromB = await providerB.loadJsonFile("shared.json")
      expect(resultFromB).toBeNull()
    })

    it("providers with the same prefix share entries", async () => {
      const provider1 = makeProvider("shared-prefix")
      const provider2 = makeProvider("shared-prefix")

      await provider1.saveJsonFile("data.json", { value: 42 })
      const result = await provider2.loadJsonFile<{ value: number }>("data.json")

      expect(result!.value).toEqual({ value: 42 })
    })
  })
})
