import { describe, expect, it } from "vitest"

import { StorageManager } from "#/lib/storage/storageManager.ts"
import type { StorageProvider, StoredJsonFile, StoredJsonFileMetadata } from "#/lib/storage/storageProvider.ts"

interface RecordedCall {
  method: string
  args: unknown[]
}

class RecordingStorageProvider implements StorageProvider {
  public readonly providerId = "mock"
  public readonly calls: RecordedCall[] = []

  public listJsonFiles(pathPrefix?: string): Promise<StoredJsonFileMetadata[]> {
    this.calls.push({ method: "listJsonFiles", args: [pathPrefix] })
    return Promise.resolve([])
  }

  public loadJsonFile<TValue>(path: string): Promise<StoredJsonFile<TValue> | null> {
    this.calls.push({ method: "loadJsonFile", args: [path] })
    return Promise.resolve(null)
  }

  public saveJsonFile<TValue>(path: string, value: TValue): Promise<StoredJsonFile<TValue>> {
    this.calls.push({ method: "saveJsonFile", args: [path, value] })
    return Promise.resolve({ path, updatedAt: "2024-01-01T00:00:00.000Z", value })
  }

  public deleteJsonFile(path: string): Promise<void> {
    this.calls.push({ method: "deleteJsonFile", args: [path] })
    return Promise.resolve()
  }
}

describe("StorageManager", () => {
  it("exposes the provider id", () => {
    // Arrange
    const manager = new StorageManager(new RecordingStorageProvider())

    // Act / Assert
    expect(manager.providerId).toBe("mock")
  })

  it("delegates listJsonFiles to the provider, forwarding the prefix", async () => {
    // Arrange
    const provider = new RecordingStorageProvider()
    const manager = new StorageManager(provider)

    // Act
    await manager.listJsonFiles("characters/")

    // Assert
    expect(provider.calls).toEqual([{ method: "listJsonFiles", args: ["characters/"] }])
  })

  it("delegates loadJsonFile to the provider", async () => {
    // Arrange
    const provider = new RecordingStorageProvider()
    const manager = new StorageManager(provider)

    // Act
    await manager.loadJsonFile("a.json")

    // Assert
    expect(provider.calls).toEqual([{ method: "loadJsonFile", args: ["a.json"] }])
  })

  it("delegates saveJsonFile to the provider with path and value", async () => {
    // Arrange
    const provider = new RecordingStorageProvider()
    const manager = new StorageManager(provider)
    const value = { hello: "world" }

    // Act
    const saved = await manager.saveJsonFile("a.json", value)

    // Assert
    expect(provider.calls).toEqual([{ method: "saveJsonFile", args: ["a.json", value] }])
    expect(saved.value).toEqual(value)
  })

  it("delegates deleteJsonFile to the provider", async () => {
    // Arrange
    const provider = new RecordingStorageProvider()
    const manager = new StorageManager(provider)

    // Act
    await manager.deleteJsonFile("a.json")

    // Assert
    expect(provider.calls).toEqual([{ method: "deleteJsonFile", args: ["a.json"] }])
  })
})
