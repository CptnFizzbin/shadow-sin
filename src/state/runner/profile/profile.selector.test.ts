import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { ProfileSelectors } from "./profile.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("ProfileSelectors.select", () => {
  it("returns the runner's profile record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(ProfileSelectors.select(stateFor(runner))).toBe(runner.profile)
  })
})

describe("ProfileSelectors.selectDisplayName", () => {
  it("falls back to the legal name when no alias is set", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.alias = ""
      data.profile.name = "John Doe"
    } })

    // Act / Assert
    expect(ProfileSelectors.selectDisplayName(stateFor(runner))).toBe("John Doe")
  })

  it("prefers the alias when set", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.alias = "Ghost"
      data.profile.name = "John Doe"
    } })

    // Act / Assert
    expect(ProfileSelectors.selectDisplayName(stateFor(runner))).toBe("Ghost")
  })
})
