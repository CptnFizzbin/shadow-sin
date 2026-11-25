import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { runnerDataFactory } from "#/data/runner/runnerData.factory.ts"
import type { RunnerData } from "#/data/runner/runnerData.ts"
import { getItemCatalog } from "#/data/runner/runnerTraits.ts"

import { EdgeSelectors } from "./edge.selector.ts"

const stateFor = (runner: RunnerData) => ({ runner, entity: runner, items: getItemCatalog(runner) })

describe("EdgeSelectors.selectMax", () => {
  it("returns the runner's Edge attribute value", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.attributes[AttributeKey.edge] = 4
    } })

    // Act / Assert
    expect(EdgeSelectors.selectMax(stateFor(runner))).toBe(4)
  })
})

describe("EdgeSelectors.selectCurrent", () => {
  it("returns the runner's current Edge", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.edge.current = 2
    } })

    // Act / Assert
    expect(EdgeSelectors.selectCurrent(stateFor(runner))).toBe(2)
  })
})
