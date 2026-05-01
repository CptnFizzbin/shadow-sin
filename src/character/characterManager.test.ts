import { beforeEach, describe, expect, it } from "vitest"

import { createDefaultCharacterSheet } from "#/components/character/sheet/createDefaultCharacterSheet.ts"
import { makeTestCharacterManager } from "#testUtils/storage/makeTestCharacterManager.ts"
import { MemoryStorage } from "#testUtils/storage/memoryStorage.ts"

import type { CharacterManager } from "./characterManager.ts"

describe("CharacterManager.listCharactersWithErrors", () => {
  let manager: CharacterManager

  beforeEach(() => {
    ;({ manager } = makeTestCharacterManager())
  })

  it("returns an empty result when storage is empty", async () => {
    const result = await manager.listCharactersWithErrors()
    expect(result.characters).toEqual({})
    expect(result.errors).toEqual([])
  })

  it("surfaces an error entry for a character with a missing version", async () => {
    // Arrange
    const { manager: localManager, provider } = makeTestCharacterManager()
    await provider.saveJsonFile("characters/bad-id.json", {})

    // Act
    const result = await localManager.listCharactersWithErrors()

    // Assert
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].characterId).toBe("bad-id")
    expect(result.errors[0].rawData).toEqual({})
    expect(result.characters).toEqual({})
  })

  it("surfaces an error entry for a character with an invalid version string", async () => {
    // Arrange
    const { manager: localManager, provider } = makeTestCharacterManager()
    await provider.saveJsonFile("characters/bad-version.json", { version: "foobar" })

    // Act
    const result = await localManager.listCharactersWithErrors()

    // Assert
    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].characterId).toBe("bad-version")
  })

  it("does not crash listCharacters when one character is invalid", async () => {
    // Arrange
    const { manager: localManager, provider } = makeTestCharacterManager()
    await provider.saveJsonFile("characters/bad.json", {})

    // Act
    const characters = await localManager.listCharacters()

    // Assert
    expect(characters).toEqual({})
  })
})

describe("CharacterManager.forceSave", () => {
  let manager: CharacterManager

  beforeEach(() => {
    ;({ manager } = makeTestCharacterManager())
  })

  it("persists the character so getCharacter returns it immediately after forceSave resolves", async () => {
    // Arrange
    const character = { ...createDefaultCharacterSheet(), id: crypto.randomUUID() }

    // Act
    await manager.forceSave(character)

    // Assert
    const loaded = await manager.getCharacter(character.id)
    expect(loaded).not.toBeNull()
    expect(loaded?.id).toBe(character.id)
  })

  it("returns the in-memory character by reference so storage is not re-read", async () => {
    // Arrange
    const character = { ...createDefaultCharacterSheet(), id: crypto.randomUUID() }

    // Act
    await manager.forceSave(character)
    const loaded = await manager.getCharacter(character.id)

    // Assert — same object reference proves the in-memory cache was used
    expect(loaded).toBe(character)
  })
})

describe("CharacterManager.save", () => {
  let manager: CharacterManager

  beforeEach(() => {
    ;({ manager } = makeTestCharacterManager())
  })

  it("makes the character available via getCharacter before the debounce fires", async () => {
    // Arrange
    const character = { ...createDefaultCharacterSheet(), id: crypto.randomUUID() }

    // Act — do not await; the debounce timer has not fired yet
    void manager.save(character)
    const loaded = await manager.getCharacter(character.id)

    // Assert — in-memory cache returns the character immediately
    expect(loaded).toBe(character)
  })

  it("debounces rapid saves so only the last value is persisted to storage", async () => {
    // Arrange
    const sharedStorage = new MemoryStorage()
    const { manager: writingManager } = makeTestCharacterManager(sharedStorage)
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
    const { manager: freshManager } = makeTestCharacterManager(sharedStorage)
    const loaded = await freshManager.getCharacter(character.id)
    expect(loaded?.profile.alias).toBe("third")
  })
})
