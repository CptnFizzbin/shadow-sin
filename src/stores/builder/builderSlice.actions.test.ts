import { describe, expect, it } from "vitest"

import { setStartingNuyen } from "./builderSlice.actions.ts"
import { builderReducer } from "./builderSlice.ts"

describe("setStartingNuyen", () => {
  it("sets startingNuyen from undefined", () => {
    // Arrange
    const state = { startingNuyen: undefined }

    // Act
    const next = builderReducer(state, setStartingNuyen(5000))

    // Assert
    expect(next.startingNuyen).toBe(5000)
  })

  it("overwrites an existing startingNuyen", () => {
    // Arrange
    const state = { startingNuyen: 1000 }

    // Act
    const next = builderReducer(state, setStartingNuyen(6000))

    // Assert
    expect(next.startingNuyen).toBe(6000)
  })

  it("clears startingNuyen back to undefined", () => {
    // Arrange
    const state = { startingNuyen: 6000 }

    // Act
    const next = builderReducer(state, setStartingNuyen(undefined))

    // Assert
    expect(next.startingNuyen).toBeUndefined()
  })
})
