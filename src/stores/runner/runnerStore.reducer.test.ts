import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { setProfileAlias, setProfileName } from "./profile/profileSlice.actions.ts"
import { runnerRootReducer } from "./runnerStore.reducer.ts"

describe.concurrent("runnerRootReducer name mirroring", () => {
  it("mirrors a newly-set alias onto the root name field", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (data) => {
      data.profile.name = "Sarah Chen"
      return data
    } })

    // Act
    const next = runnerRootReducer(runner, setProfileAlias("Ghost"))

    // Assert
    expect(next.name).toBe("Ghost")
  })

  it("falls back to the legal name once the alias is cleared", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (data) => {
      data.profile.alias = "Ghost"
      data.profile.name = "Sarah Chen"
      data.name = "Ghost"
      return data
    } })

    // Act
    const next = runnerRootReducer(runner, setProfileAlias(""))

    // Assert
    expect(next.name).toBe("Sarah Chen")
  })

  it("mirrors a legal name change while no alias is set", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (data) => data })

    // Act
    const next = runnerRootReducer(runner, setProfileName("Sarah Chen"))

    // Assert
    expect(next.name).toBe("Sarah Chen")
  })

  it("keeps the alias in front of the legal name for unrelated actions", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (data) => {
      data.profile.alias = "Ghost"
      data.profile.name = "Sarah Chen"
      data.name = "Ghost"
      return data
    } })

    // Act
    const next = runnerRootReducer(runner, setProfileName("Sarah Chen-Wu"))

    // Assert
    expect(next.name).toBe("Ghost")
  })
})
