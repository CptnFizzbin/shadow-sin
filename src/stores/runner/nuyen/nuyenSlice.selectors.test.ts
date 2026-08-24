import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { NuyenSelectors, selectLoans, selectNuyen, selectNuyenAmount } from "./nuyenSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe("selectNuyen", () => {
  it("returns the runner's nuyen record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectNuyen(runner)).toBe(runner.nuyen)
  })
})

describe("selectNuyenAmount", () => {
  it("returns the runner's current nuyen", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.nuyen.current = 1500
      return s
    } })

    // Act / Assert
    expect(selectNuyenAmount(runner)).toBe(1500)
  })
})

describe("selectLoans", () => {
  it("returns the runner's loans", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(selectLoans(runner)).toBe(runner.nuyen.loans)
  })
})

describe("NuyenSelectors.select", () => {
  it("returns the runner's nuyen record", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(NuyenSelectors.select(stateFor(runner))).toBe(runner.nuyen)
  })
})

describe("NuyenSelectors.selectAmount", () => {
  it("returns the runner's current nuyen", () => {
    // Arrange
    const runner = runnerDataFactory({ override: (s) => {
      s.nuyen.current = 1500
      return s
    } })

    // Act / Assert
    expect(NuyenSelectors.selectAmount(stateFor(runner))).toBe(1500)
  })
})

describe("NuyenSelectors.selectLoans", () => {
  it("returns the runner's loans", () => {
    // Arrange
    const runner = runnerDataFactory()

    // Act / Assert
    expect(NuyenSelectors.selectLoans(stateFor(runner))).toBe(runner.nuyen.loans)
  })
})
