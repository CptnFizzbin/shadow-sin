import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { patchLifestyle } from "./lifestyle/lifestyle.actions.ts"
import { setProfileAlias, setProfileName } from "./profile/profile.actions.ts"
import { runnerRootReducer } from "./runnerStore.reducer.ts"

describe.concurrent("runnerRootReducer name mirroring", () => {
  it("mirrors a newly-set alias onto the root name field", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.name = "Sarah Chen"
    } })

    // Act
    const next = runnerRootReducer(runner, setProfileAlias("Ghost"))

    // Assert
    expect(next.name).toBe("Ghost")
  })

  it("falls back to the legal name once the alias is cleared", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.alias = "Ghost"
      data.profile.name = "Sarah Chen"
      data.name = "Ghost"
    } })

    // Act
    const next = runnerRootReducer(runner, setProfileAlias(""))

    // Assert
    expect(next.name).toBe("Sarah Chen")
  })

  it("mirrors a legal name change while no alias is set", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const next = runnerRootReducer(runner, setProfileName("Sarah Chen"))

    // Assert
    expect(next.name).toBe("Sarah Chen")
  })

  it("keeps the alias in front when the legal name changes", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.alias = "Ghost"
      data.profile.name = "Sarah Chen"
      data.name = "Ghost"
    } })

    // Act
    const next = runnerRootReducer(runner, setProfileName("Sarah Chen-Wu"))

    // Assert
    expect(next.name).toBe("Ghost")
  })

  it("recomputes the name from the alias for unrelated actions", () => {
    // Arrange — a stale root name proves the mirror is recomputed rather than carried over
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.alias = "Ghost"
      data.profile.name = "Sarah Chen"
      data.name = "Stale Name"
    } })

    // Act
    const next = runnerRootReducer(runner, patchLifestyle({ notes: "Safehouse" }))

    // Assert
    expect(next.name).toBe("Ghost")
  })
})
