import { describe, expect, it } from "vitest"

import { LifestyleType } from "#/system/model/finances/lifestyleType.ts"
import type { RunnerData } from "#/system/model/runnerData.ts"

import { ProfileActions } from "./profile.actions.ts"
import { profileReducer } from "./profile.state.ts"

const makeProfile = (overrides: Partial<RunnerData["profile"]> = {}): RunnerData["profile"] => ({
  alias: "Anduin",
  name: "Man",
  archetype: "Drone Rigger",
  description: null,
  personality: null,
  lifestyle: { quality: LifestyleType.Middle, monthsPaid: 1 },
  ...overrides,
})

describe.concurrent("ProfileActions.patch", () => {
  it("overwrites the given profile fields", () => {
    // Arrange
    const state = makeProfile()

    // Act
    const next = profileReducer(state, ProfileActions.patch({
      alias: "Ghost",
      name: "Jane Doe",
      archetype: null,
      description: "Tall and quiet",
      personality: "Cautious",
    }))

    // Assert
    expect(next.alias).toBe("Ghost")
    expect(next.name).toBe("Jane Doe")
    expect(next.archetype).toBeNull()
    expect(next.description).toBe("Tall and quiet")
    expect(next.personality).toBe("Cautious")
  })

  it("leaves fields missing from the payload untouched", () => {
    // Arrange
    const state = makeProfile()

    // Act
    const next = profileReducer(state, ProfileActions.patch({ alias: "Ghost" }))

    // Assert
    expect(next).toEqual({ ...state, alias: "Ghost" })
  })
})
