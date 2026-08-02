import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { selectPublicAwareness } from "./profileSlice.selectors.ts"

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
