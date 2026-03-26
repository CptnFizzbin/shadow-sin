import { beforeEach, describe, expect, it, vi } from "vitest"

import type { IStorageProvider } from "#/lib/storage/IStorageProvider.ts"
import { StorageManager } from "#/lib/storage/StorageManager.ts"

function makeProvider(
  overrides: Partial<IStorageProvider> = {},
): IStorageProvider {
  return {
    providerId: "mock-provider",
    listJsonFiles: vi.fn().mockResolvedValue([]),
    loadJsonFile: vi.fn().mockResolvedValue(null),
    saveJsonFile: vi.fn().mockResolvedValue({ path: "", updatedAt: "", value: null }),
    deleteJsonFile: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  }
}

describe("StorageManager", () => {
  let provider: IStorageProvider
  let manager: StorageManager

  beforeEach(() => {
    provider = makeProvider()
    manager = new StorageManager(provider)
  })

  describe("providerId", () => {
    it("forwards the provider id", () => {
      expect(manager.providerId).toBe("mock-provider")
    })
  })

  describe("listJsonFiles", () => {
    it("delegates to the provider and returns its result", async () => {
      const mockFiles = [{ path: "a.json", updatedAt: "2024-01-01T00:00:00Z" }]
      vi.mocked(provider.listJsonFiles).mockResolvedValueOnce(mockFiles)

      const result = await manager.listJsonFiles()

      expect(provider.listJsonFiles).toHaveBeenCalledOnce()
      expect(result).toEqual(mockFiles)
    })

    it("passes the optional path prefix through to the provider", async () => {
      await manager.listJsonFiles("characters")

      expect(provider.listJsonFiles).toHaveBeenCalledWith("characters")
    })
  })

  describe("loadJsonFile", () => {
    it("delegates to the provider with the given path", async () => {
      const mockFile = {
        path: "characters/neo.json",
        updatedAt: "2024-01-01T00:00:00Z",
        value: { id: "neo" },
      }
      vi.mocked(provider.loadJsonFile).mockResolvedValueOnce(mockFile)

      const result = await manager.loadJsonFile("characters/neo.json")

      expect(provider.loadJsonFile).toHaveBeenCalledWith("characters/neo.json")
      expect(result).toEqual(mockFile)
    })

    it("returns null when the provider returns null", async () => {
      const result = await manager.loadJsonFile("missing.json")
      expect(result).toBeNull()
    })
  })

  describe("saveJsonFile", () => {
    it("delegates to the provider and returns the stored file", async () => {
      const payload = { id: "morpheus" }
      const mockResult = {
        path: "characters/morpheus.json",
        updatedAt: "2024-01-01T00:00:00Z",
        value: payload,
      }
      vi.mocked(provider.saveJsonFile).mockResolvedValueOnce(mockResult)

      const result = await manager.saveJsonFile(
        "characters/morpheus.json",
        payload,
      )

      expect(provider.saveJsonFile).toHaveBeenCalledWith(
        "characters/morpheus.json",
        payload,
      )
      expect(result).toEqual(mockResult)
    })
  })

  describe("deleteJsonFile", () => {
    it("delegates to the provider with the given path", async () => {
      await manager.deleteJsonFile("characters/neo.json")

      expect(provider.deleteJsonFile).toHaveBeenCalledWith(
        "characters/neo.json",
      )
    })
  })
})
