import { describe, expect, it } from "vitest"

import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { ProfileSelectors } from "./profileSlice.selectors.ts"

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

describe("ProfileSelectors.selectLifestyleQuality/selectLifestyleMonthsPaid/selectLifestyleInfo", () => {
  it("returns undefined for all three when no lifestyle is set", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.lifestyle = null
    } })

    // Act / Assert
    expect(ProfileSelectors.selectLifestyleQuality(stateFor(runner))).toBeUndefined()
    expect(ProfileSelectors.selectLifestyleMonthsPaid(stateFor(runner))).toBeUndefined()
    expect(ProfileSelectors.selectLifestyleInfo(stateFor(runner))).toBeUndefined()
  })

  it("returns the denormalized lifestyle once one is set", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.profile.lifestyle = { quality: LifestyleType.Middle, monthsPaid: 2 }
    } })

    // Act / Assert
    expect(ProfileSelectors.selectLifestyleQuality(stateFor(runner))).toBe(LifestyleType.Middle)
    expect(ProfileSelectors.selectLifestyleMonthsPaid(stateFor(runner))).toBe(2)
    expect(ProfileSelectors.selectLifestyleInfo(stateFor(runner))).toBe(Lifestyles[LifestyleType.Middle])
  })
})
