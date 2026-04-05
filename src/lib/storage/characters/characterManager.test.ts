import { beforeEach, describe, expect, it } from "vitest"

import { CharacterManager } from "#/lib/storage/characters/characterManager.ts"
import { LocalStorageProvider } from "#/lib/storage/localStorage/localStorageProvider.ts"
import { StorageManager } from "#/lib/storage/storageManager.ts"
import { MemoryStorage } from "#testUtils/storage/memoryStorage.ts"

function makeManager(): CharacterManager {
  const memStorage = new MemoryStorage()
  const provider = new LocalStorageProvider({ storagePrefix: "test" })

  // Patch provider to use MemoryStorage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(provider as any).getStorage = () => memStorage

  return new CharacterManager(new StorageManager(provider))
}

describe("CharacterManager.listCharactersWithErrors", () => {
  let manager: CharacterManager

  beforeEach(() => {
    manager = makeManager()
  })

  it("returns an empty result when storage is empty", async () => {
    const result = await manager.listCharactersWithErrors()
    expect(result.characters).toEqual({})
    expect(result.errors).toEqual([])
  })

  it("surfaces an error entry for a character with a missing version", async () => {
    // Write a raw invalid character directly via storage
    const provider = new LocalStorageProvider({ storagePrefix: "test" })
    const memStorage = new MemoryStorage()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(provider as any).getStorage = () => memStorage
    const storageManager = new StorageManager(provider)
    await storageManager.saveJsonFile("characters/bad-id.json", {})

    const localManager = new CharacterManager(storageManager)
    const result = await localManager.listCharactersWithErrors()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].characterId).toBe("bad-id")
    expect(result.errors[0].rawData).toEqual({})
    expect(result.characters).toEqual({})
  })

  it("surfaces an error entry for a character with an invalid version string", async () => {
    const provider = new LocalStorageProvider({ storagePrefix: "test" })
    const memStorage = new MemoryStorage()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(provider as any).getStorage = () => memStorage
    const storageManager = new StorageManager(provider)
    await storageManager.saveJsonFile("characters/bad-version.json", { version: "foobar" })

    const localManager = new CharacterManager(storageManager)
    const result = await localManager.listCharactersWithErrors()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].characterId).toBe("bad-version")
  })

  it("does not crash listCharacters when one character is invalid", async () => {
    const provider = new LocalStorageProvider({ storagePrefix: "test" })
    const memStorage = new MemoryStorage()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(provider as any).getStorage = () => memStorage
    const storageManager = new StorageManager(provider)
    await storageManager.saveJsonFile("characters/bad.json", {})

    const localManager = new CharacterManager(storageManager)
    const characters = await localManager.listCharacters()
    expect(characters).toEqual({})
  })
})
