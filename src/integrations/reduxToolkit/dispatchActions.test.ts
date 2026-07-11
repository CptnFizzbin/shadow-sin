import type { UnknownAction } from "@reduxjs/toolkit"
import { describe, expect, it } from "vitest"

import { applyActions } from "./dispatchActions.ts"

const increment = (amount: number): UnknownAction => ({ type: "increment", payload: amount })
const reducer = (state: number, action: UnknownAction): number => {
  if (action.type === "increment") return state + (action.payload as number)
  return state
}

describe("applyActions", () => {
  it("applies a single action", () => {
    // Arrange / Act
    const next = applyActions(reducer, 0, increment(5))

    // Assert
    expect(next).toBe(5)
  })

  it("folds an array of actions in order, atomically", () => {
    // Arrange / Act
    const next = applyActions(reducer, 0, [increment(1), increment(2), increment(3)])

    // Assert
    expect(next).toBe(6)
  })

  it("returns state unchanged for an empty array", () => {
    // Arrange / Act
    const next = applyActions(reducer, 7, [])

    // Assert
    expect(next).toBe(7)
  })

  it("resolves an ActionChain against the current state before folding", () => {
    // Arrange: a thunk that doubles the current state via two increments computed from `state`
    const doubleViaThunk = (state: number) => [increment(state), increment(state)]

    // Act
    const next = applyActions(reducer, 5, doubleViaThunk)

    // Assert
    expect(next).toBe(15) // 5 + 5 + 5
  })
})
