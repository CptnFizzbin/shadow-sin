import { act, cleanup, render, renderHook, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { afterEach, describe, expect, it } from "vitest"

import { saveGameConfig } from "#/gameConfig/gameConfigUtils.ts"
import { createMemoryStorage } from "#/lib/storage/providers/memoryStorageProvider.ts"
import type { GameConfig } from "#/system/gameConfig.ts"
import { defaultGameConfig } from "#/system/gameConfig.ts"

import { GameConfigProvider, useGameConfig } from "./gameConfigProvider.tsx"

afterEach(() => cleanup())

const persistedConfig: GameConfig = {
  name: "Seattle Sprawl",
  featureFlags: { optionalRules: { encumbranceEnabled: false } },
}

function makeWrapper(storage = createMemoryStorage()): FC<PropsWithChildren> {
  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <GameConfigProvider storage={storage}>{children}</GameConfigProvider>
  )
  Wrapper.displayName = "TestGameConfigWrapper"
  return Wrapper
}

describe("GameConfigProvider", () => {
  it("renders children", () => {
    // Arrange & Act
    const { getByText } = render(
      <GameConfigProvider storage={createMemoryStorage()}>
        <div>child</div>
      </GameConfigProvider>,
    )

    // Assert
    expect(getByText("child")).toBeDefined()
  })

  it("starts with defaultGameConfig before storage resolves", () => {
    // Arrange
    const wrapper = makeWrapper()

    // Act
    const { result } = renderHook(() => useGameConfig(), { wrapper })

    // Assert
    expect(result.current.config).toEqual(defaultGameConfig)
  })

  it("loads a persisted config from storage on mount", async () => {
    // Arrange
    const storage = createMemoryStorage()
    await saveGameConfig(storage, persistedConfig)

    // Act
    const { result } = renderHook(() => useGameConfig(), { wrapper: makeWrapper(storage) })

    // Assert — wait for the async load effect to populate state
    await waitFor(() => {
      expect(result.current.config).toEqual(persistedConfig)
    })
  })

  it("keeps defaultGameConfig when no config has been saved", async () => {
    // Arrange
    const storage = createMemoryStorage()

    // Act
    const { result } = renderHook(() => useGameConfig(), { wrapper: makeWrapper(storage) })

    // Assert — give the effect a chance to run; state must stay at default
    await waitFor(() => {
      expect(result.current.config).toEqual(defaultGameConfig)
    })
  })

  it("setConfig updates context state and persists to storage", async () => {
    // Arrange
    const storage = createMemoryStorage()
    const { result } = renderHook(() => useGameConfig(), { wrapper: makeWrapper(storage) })

    // Act
    act(() => {
      result.current.setConfig(persistedConfig)
    })

    // Assert — context value reflects the new config
    expect(result.current.config).toEqual(persistedConfig)

    // Assert — and storage was updated
    await waitFor(async () => {
      const raw = await storage.getItem("game-config")
      expect(raw).toEqual(persistedConfig)
    })
  })

  it("useGameConfig throws when used outside the provider", () => {
    // Arrange — silence React's expected error log; restore in finally so a
    // failed assertion can't leak the override to other tests.
    const originalError = console.error
    console.error = () => {}

    try {
      // Act & Assert
      expect(() => renderHook(() => useGameConfig())).toThrow(
        /useGameConfig must be used within GameConfigProvider/,
      )
    } finally {
      console.error = originalError
    }
  })
})
