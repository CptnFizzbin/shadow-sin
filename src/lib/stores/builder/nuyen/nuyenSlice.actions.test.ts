import { describe, expect, it } from "vitest"

import { setStartingNuyen } from "./nuyenSlice.actions.ts"
import { nuyenReducer } from "./nuyenSlice.ts"

describe.concurrent("setStartingNuyen", () => {
  it("sets startingNuyen from null", () => {
    // Arrange
    const state = { starting: null }

    // Act
    const next = nuyenReducer(state, setStartingNuyen(5000))

    // Assert
    expect(next.starting).toBe(5000)
  })

  it("overwrites an existing startingNuyen", () => {
    // Arrange
    const state = { starting: 1000 }

    // Act
    const next = nuyenReducer(state, setStartingNuyen(6000))

    // Assert
    expect(next.starting).toBe(6000)
  })

  it("clears startingNuyen back to null", () => {
    // Arrange
    const state = { starting: 6000 }

    // Act
    const next = nuyenReducer(state, setStartingNuyen(undefined))

    // Assert
    expect(next.starting).toBeNull()
  })
})
