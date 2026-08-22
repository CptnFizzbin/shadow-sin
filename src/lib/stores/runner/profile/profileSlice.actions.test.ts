import { describe, expect, it } from "vitest"

import { setNotoriety, setStreetCred } from "./profileSlice.actions.ts"
import { profileReducer } from "./profileSlice.ts"

describe.concurrent("setStreetCred", () => {
  it("sets streetCred to the given value", () => {
    // Arrange
    const state = profileReducer(undefined, { type: "@@INIT" })

    // Act
    const next = profileReducer(state, setStreetCred(4))

    // Assert
    expect(next.streetCred).toBe(4)
  })
})

describe.concurrent("setNotoriety", () => {
  it("sets notoriety to the given value", () => {
    // Arrange
    const state = profileReducer(undefined, { type: "@@INIT" })

    // Act
    const next = profileReducer(state, setNotoriety(2))

    // Assert
    expect(next.notoriety).toBe(2)
  })
})
