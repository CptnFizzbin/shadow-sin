import { beforeEach, describe, expect, it } from "vitest"

import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { makeTestCharacterManager } from "#testUtils/storage/makeTestCharacterManager.ts"

import { CharacterManager } from "./characterManager.ts"

describe("CharacterManager.listCharactersWithErrors", () => {
  let manager: CharacterManager

  beforeEach(() => {
    manager = makeTestCharacterManager().manager
  })

  it("returns an empty result when storage is empty", async () => {
    // Arrange — no setup needed

    // Act
    const result = await manager.listCharactersWithErrors()

    // Assert
    expect(result.characters).toEqual({})
    expect(result.errors).toEqual([])
  })

  it("surfaces an error entry for a character with a missing version", async () => {
    // Arrange
    const { manager: localManager, storage } = makeTestCharacterManager()
    await storage.setItem("index", [{ id: "bad-id", name: "bad", lastModified: "2024-01-01T00:00:00.000Z" }])
    await storage.setItem("characters/bad-id", {})

    // Act
    const result = await localManager.listCharactersWithErrors()

    // Assert
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].characterId).toBe("bad-id")
    expect(result.characters).toEqual({})
  })

  it("surfaces an error entry for a character with an invalid version string", async () => {
    // Arrange
    const { manager: localManager, storage } = makeTestCharacterManager()
    await storage.setItem("index", [{ id: "bad-version", name: "bad", lastModified: "2024-01-01T00:00:00.000Z" }])
    await storage.setItem("characters/bad-version", { version: "foobar" })

    // Act
    const result = await localManager.listCharactersWithErrors()

    // Assert
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].characterId).toBe("bad-version")
  })

  it("does not crash listCharacters when one character is invalid", async () => {
    // Arrange
    const { manager: localManager, storage } = makeTestCharacterManager()
    await storage.setItem("index", [{ id: "bad", name: "bad", lastModified: "2024-01-01T00:00:00.000Z" }])
    await storage.setItem("characters/bad", {})

    // Act
    const characters = await localManager.listCharacters()

    // Assert — listCharacters reads from index, not by scanning; the character is in the index
    expect(characters).toHaveLength(1)
    expect(characters[0].id).toBe("bad")
    // The entry appears in the index but loading it throws because the stored data is invalid
    await expect(localManager.getCharacter("bad")).rejects.toThrow()
  })
})

describe("CharacterManager.saveCharacter / getCharacter", () => {
  let manager: CharacterManager

  beforeEach(() => {
    manager = makeTestCharacterManager().manager
  })

  it("persists the character so getCharacter returns it immediately after saveCharacter resolves", async () => {
    // Arrange
    const character = { ...createDefaultCharacterSheet(), id: crypto.randomUUID() }

    // Act
    await manager.saveCharacter(character)

    // Assert
    const loaded = await manager.getCharacter(character.id)
    expect(loaded).not.toBeNull()
    expect(loaded.id).toBe(character.id)
  })

  it("throws CharacterNotFoundError for an unknown character id", async () => {
    // Arrange
    const unknownId = crypto.randomUUID()

    // Act / Assert
    await expect(manager.getCharacter(unknownId)).rejects.toThrow("Character not found")
  })
})

describe("CharacterManager.listCharacters", () => {
  it("returns saved character metadata from the index", async () => {
    // Arrange
    const { manager } = makeTestCharacterManager()
    const character = { ...createDefaultCharacterSheet(), id: crypto.randomUUID() }

    // Act
    await manager.saveCharacter(character)
    const list = await manager.listCharacters()

    // Assert
    expect(list).toHaveLength(1)
    expect(list[0].id).toBe(character.id)
    expect(list[0].name).toBe(character.profile.alias)
  })
})

describe("CharacterManager.deleteCharacter", () => {
  it("removes the character so subsequent getCharacter throws", async () => {
    // Arrange
    const { manager } = makeTestCharacterManager()
    const character = { ...createDefaultCharacterSheet(), id: crypto.randomUUID() }
    await manager.saveCharacter(character)

    // Act
    await manager.deleteCharacter(character.id)

    // Assert
    await expect(manager.getCharacter(character.id)).rejects.toThrow("Character not found")
  })
})

describe("CharacterManager.save (debounced)", () => {
  it("debounces rapid saves so only the last value is persisted to storage", async () => {
    // Arrange
    const { manager: writingManager, storage } = makeTestCharacterManager()
    const character = { ...createDefaultCharacterSheet(), id: crypto.randomUUID() }
    const first = { ...character, profile: { ...character.profile, alias: "first" } }
    const second = { ...character, profile: { ...character.profile, alias: "second" } }
    const third = { ...character, profile: { ...character.profile, alias: "third" } }

    // Act: fire three saves synchronously before any timer fires
    const saves = Promise.all([
      writingManager.save(first),
      writingManager.save(second),
      writingManager.save(third),
    ])
    await saves

    // Assert — only the last alias reaches storage; bypass the cache with a fresh manager
    const freshManager = new CharacterManager({ local: storage }, 0)
    const loaded = await freshManager.getCharacter(character.id)
    expect(loaded.profile.alias).toBe("third")
  })
})
