import { describe, expect, it } from "vitest"

import { applyActions } from "#/integrations/reduxToolkit/dispatchActions.ts"
import { runnerRootReducer } from "#/stores/runner/runnerStore.reducer.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { burnEdge } from "./edgeSlice.actions.ts"

describe("burnEdge", () => {
  it("resets current to 0 and permanently reduces max by 1, in one atomic write", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.attributes[AttributeKey.edge] = 4
      data.edge.current = 3
      return data
    })

    // Act
    const next = applyActions(runnerRootReducer, runner, burnEdge())

    // Assert
    expect(next.edge.current).toBe(0)
    expect(next.attributes[AttributeKey.edge]).toBe(3)
  })

  it("never reduces max below 1", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.attributes[AttributeKey.edge] = 1
      data.edge.current = 1
      return data
    })

    // Act
    const next = applyActions(runnerRootReducer, runner, burnEdge())

    // Assert
    expect(next.attributes[AttributeKey.edge]).toBe(1)
  })

  it("doesn't touch unrelated fields", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.attributes[AttributeKey.edge] = 4
      data.karma.current = 10
      return data
    })

    // Act
    const next = applyActions(runnerRootReducer, runner, burnEdge())

    // Assert
    expect(next.karma.current).toBe(10)
    expect(next.attributes[AttributeKey.body]).toBe(runner.attributes[AttributeKey.body])
  })
})
