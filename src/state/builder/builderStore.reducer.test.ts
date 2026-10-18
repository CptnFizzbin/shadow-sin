import { describe, expect, it } from "vitest"

import { builderStateFactory } from "#/components/builder/builderState.ts"

import { BuilderActions } from "./builderStore.actions.ts"
import { builderStoreReducer } from "./builderStore.reducer.ts"

describe.concurrent("BuilderActions.reset", () => {
  it("clears the starting nuyen", () => {
    // Arrange
    const state = builderStoreReducer(builderStateFactory(), BuilderActions.nuyen.setStartingNuyen(250000))

    // Act
    const next = builderStoreReducer(state, BuilderActions.reset())

    // Assert
    expect(next.nuyen.starting).toBeNull()
  })
})
