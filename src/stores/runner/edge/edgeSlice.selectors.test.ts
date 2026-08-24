import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { EdgeSelectors } from "./edgeSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner, entity: runner })

describe("EdgeSelectors.selectMax", () => {
  it("returns the runner's Edge attribute value", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.attributes[AttributeKey.edge] = 4
      return s
    })

    // Act / Assert
    expect(EdgeSelectors.selectMax(stateFor(runner))).toBe(4)
  })
})

describe("EdgeSelectors.selectCurrent", () => {
  it("returns the runner's current Edge", () => {
    // Arrange
    const runner = runnerDataFactory((s) => {
      s.edge.current = 2
      return s
    })

    // Act / Assert
    expect(EdgeSelectors.selectCurrent(stateFor(runner))).toBe(2)
  })
})
