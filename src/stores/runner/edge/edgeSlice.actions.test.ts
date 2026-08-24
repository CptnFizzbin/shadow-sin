import { describe, expect, it } from "vitest"

import { dispatchThunk } from "#/stores/runner/runnerStore.dispatch.ts"
import { runnerRootReducer } from "#/stores/runner/runnerStore.reducer.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"

import { burnEdge, spendEdge } from "./edgeSlice.actions.ts"

describe.concurrent("spendEdge", () => {
  it("clamps to the current edge, not a caller-supplied value", async () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.attributes[AttributeKey.edge] = 3
      data.edge.current = 3
      return data
    })

    // Act: a thunk — resolved against `runner` to read edge.current for the clamp
    const next = await dispatchThunk(runner, spendEdge(10))

    // Assert
    expect(next.edge.current).toBe(3)
  })

  it("never drops current below 0", async () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.attributes[AttributeKey.edge] = 3
      data.edge.current = 1
      return data
    })

    // Act
    const next = await dispatchThunk(runner, spendEdge(-5))

    // Assert
    expect(next.edge.current).toBe(0)
  })

  it("doesn't touch attributes", async () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.attributes[AttributeKey.edge] = 3
      data.edge.current = 3
      return data
    })

    // Act
    const next = await dispatchThunk(runner, spendEdge(1))

    // Assert
    expect(next.attributes[AttributeKey.edge]).toBe(3)
  })
})

describe.concurrent("burnEdge", () => {
  it("resets current to 0 and permanently reduces max by 1, in one atomic write", () => {
    // Arrange
    const runner = runnerDataFactory((data) => {
      data.attributes[AttributeKey.edge] = 4
      data.edge.current = 3
      return data
    })

    // Act: a single action, fanned out to both edgeReducer and attributesReducer by combineReducers
    const next = runnerRootReducer(runner, burnEdge())

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
    const next = runnerRootReducer(runner, burnEdge())

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
    const next = runnerRootReducer(runner, burnEdge())

    // Assert
    expect(next.karma.current).toBe(10)
    expect(next.attributes[AttributeKey.body]).toBe(runner.attributes[AttributeKey.body])
  })
})
