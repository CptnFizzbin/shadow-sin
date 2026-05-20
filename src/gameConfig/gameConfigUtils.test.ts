import { describe, expect, it } from "vitest"

import { createMemoryStorage } from "#/lib/storage/providers/memoryStorageProvider.ts"
import type { GameConfig } from "#/system/gameConfig.ts"
import { defaultGameConfig } from "#/system/gameConfig.ts"

import {
  gameConfigToYaml,
  loadGameConfig,
  saveGameConfig,
  yamlToGameConfig,
} from "./gameConfigUtils.ts"

describe("gameConfigToYaml / yamlToGameConfig round-trip", () => {
  it("round-trips defaultGameConfig without data loss", () => {
    // Act
    const yaml = gameConfigToYaml(defaultGameConfig)
    const restored = yamlToGameConfig(yaml)

    // Assert
    expect(restored).toEqual(defaultGameConfig)
  })

  it("round-trips a populated GameConfig", () => {
    // Arrange
    const config: GameConfig = {
      name: "Seattle Sprawl",
      featureFlags: {
        optionalRules: { encumbranceEnabled: true },
      },
    }

    // Act
    const yaml = gameConfigToYaml(config)
    const restored = yamlToGameConfig(yaml)

    // Assert
    expect(restored).toEqual(config)
  })

  it("round-trips a GameConfig with a partial optionalRules override", () => {
    // Arrange
    const config: GameConfig = {
      name: "Hong Kong",
      featureFlags: { optionalRules: {} },
    }

    // Act
    const yaml = gameConfigToYaml(config)
    const restored = yamlToGameConfig(yaml)

    // Assert
    expect(restored).toEqual(config)
    expect(restored.featureFlags?.optionalRules).not.toHaveProperty("encumbranceEnabled")
  })
})

describe("loadGameConfig / saveGameConfig", () => {
  it("returns null when no GameConfig has been saved", async () => {
    // Arrange
    const storage = createMemoryStorage()

    // Act
    const result = await loadGameConfig(storage)

    // Assert
    expect(result).toBeNull()
  })

  it("round-trips a GameConfig through storage", async () => {
    // Arrange
    const storage = createMemoryStorage()
    const config: GameConfig = {
      name: "Berlin Z-Zone",
      featureFlags: { optionalRules: { encumbranceEnabled: true } },
    }

    // Act
    await saveGameConfig(storage, config)
    const loaded = await loadGameConfig(storage)

    // Assert
    expect(loaded).toEqual(config)
  })

  it("writes to the well-known `game-config` key", async () => {
    // Arrange
    const storage = createMemoryStorage()
    const config: GameConfig = { name: "Test" }

    // Act
    await saveGameConfig(storage, config)
    const raw = await storage.getItem("game-config")

    // Assert
    expect(raw).toEqual(config)
  })
})
