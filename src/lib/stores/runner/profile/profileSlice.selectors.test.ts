import { describe, expect, it } from "vitest"

import { Lifestyles, LifestyleType } from "#/system/lifestyleType.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { ProfileSelectors, selectPublicAwareness } from "./profileSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("selectPublicAwareness", () => {
  it("computes floor((streetCred + notoriety) / 3) plus the modifier", () => {
    // Arrange
    const state = runnerDataFactory((data) => {
      data.profile.streetCred = 5
      data.profile.notoriety = 2
      data.profile.publicAwarenessModifier = 1
      return data
    })

    // Act
    const publicAwareness = selectPublicAwareness(state)

    // Assert: floor((5 + 2) / 3) + 1 = 2 + 1 = 3
    expect(publicAwareness).toBe(3)
  })

  it("defaults the modifier to 0 when unset", () => {
    // Arrange
    const state = runnerDataFactory((data) => {
      data.profile.streetCred = 4
      data.profile.notoriety = 0
      return data
    })

    // Act
    const publicAwareness = selectPublicAwareness(state)

    // Assert: floor(4 / 3) + 0 = 1
    expect(publicAwareness).toBe(1)
  })

  it("never returns a value below 0", () => {
    // Arrange
    const state = runnerDataFactory((data) => {
      data.profile.streetCred = 0
      data.profile.notoriety = 0
      data.profile.publicAwarenessModifier = -5
      return data
    })

    // Act
    const publicAwareness = selectPublicAwareness(state)

    // Assert
    expect(publicAwareness).toBe(0)
  })
})

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
    const runner = runnerDataFactory((data) => {
      data.profile.alias = ""
      data.profile.name = "John Doe"
      return data
    })

    // Act / Assert
    expect(ProfileSelectors.selectDisplayName(stateFor(runner))).toBe("John Doe")
  })

  it("prefers the alias when set", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.profile.alias = "Ghost"
      data.profile.name = "John Doe"
      return data
    })

    // Act / Assert
    expect(ProfileSelectors.selectDisplayName(stateFor(runner))).toBe("Ghost")
  })
})

describe("ProfileSelectors.selectPublicAwareness", () => {
  it("computes floor((streetCred + notoriety) / 3) plus the modifier", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.profile.streetCred = 5
      data.profile.notoriety = 2
      data.profile.publicAwarenessModifier = 1
      return data
    })

    // Act / Assert: floor((5 + 2) / 3) + 1 = 2 + 1 = 3
    expect(ProfileSelectors.selectPublicAwareness(stateFor(runner))).toBe(3)
  })
})

describe("ProfileSelectors.selectLifestyleQuality/selectLifestyleMonthsPaid/selectLifestyleInfo", () => {
  it("returns undefined for all three when no lifestyle is set", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.profile.lifestyle = null
      return data
    })

    // Act / Assert
    expect(ProfileSelectors.selectLifestyleQuality(stateFor(runner))).toBeUndefined()
    expect(ProfileSelectors.selectLifestyleMonthsPaid(stateFor(runner))).toBeUndefined()
    expect(ProfileSelectors.selectLifestyleInfo(stateFor(runner))).toBeUndefined()
  })

  it("returns the denormalized lifestyle once one is set", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.profile.lifestyle = { quality: LifestyleType.Middle, monthsPaid: 2 }
      return data
    })

    // Act / Assert
    expect(ProfileSelectors.selectLifestyleQuality(stateFor(runner))).toBe(LifestyleType.Middle)
    expect(ProfileSelectors.selectLifestyleMonthsPaid(stateFor(runner))).toBe(2)
    expect(ProfileSelectors.selectLifestyleInfo(stateFor(runner))).toBe(Lifestyles[LifestyleType.Middle])
  })
})
