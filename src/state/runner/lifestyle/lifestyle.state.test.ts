import { describe, expect, it } from "vitest"

import { runnerRootReducer } from "#/state/runner/runnerStore.reducer.ts"
import { LifestyleType } from "#/system/model/finances/lifestyleType.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { patchLifestyle, prepayLifestyle, setLifestyleMonthsPaid, setStandardLifestyle } from "./lifestyle.actions.ts"

describe.concurrent("lifestyleReducer", () => {
  it("setStandardLifestyle sets the standard name and upkeep, keeping months and notes", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.lifestyle = { name: "Custom", upkeep: 123, monthsPaid: 4, notes: "Safehouse" }
    } })

    // Act
    const next = runnerRootReducer(runner, setStandardLifestyle(LifestyleType.High))

    // Assert
    expect(next.lifestyle).toEqual({ name: "High", upkeep: 10_000, monthsPaid: 4, notes: "Safehouse" })
  })

  it("patchLifestyle overwrites only the given fields", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.lifestyle = { name: "Custom", upkeep: 123, monthsPaid: 4, notes: "Safehouse" }
    } })

    // Act
    const next = runnerRootReducer(runner, patchLifestyle({ name: "Trust Fund", upkeep: -5_000 }))

    // Assert
    expect(next.lifestyle).toEqual({ name: "Trust Fund", upkeep: -5_000, monthsPaid: 4, notes: "Safehouse" })
  })

  it("setLifestyleMonthsPaid never goes below zero", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act
    const next = runnerRootReducer(runner, setLifestyleMonthsPaid(-2))

    // Assert
    expect(next.lifestyle.monthsPaid).toBe(0)
  })

  it("prepayLifestyle adds the months and withdraws the cost in one write", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (data) => {
      data.lifestyle = { name: "Low", upkeep: 2_000, monthsPaid: 1 }
      data.nuyen.current = 10_000
    } })

    // Act
    const next = runnerRootReducer(runner, prepayLifestyle({ months: 3, nuyenCost: 6_000 }))

    // Assert
    expect(next.lifestyle.monthsPaid).toBe(4)
    expect(next.nuyen.current).toBe(4_000)
  })
})
