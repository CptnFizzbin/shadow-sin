import { describe, expect, it } from "vitest"

import { sellItem } from "#/state/runner/items/items.actions.ts"
import type { UUID } from "#/utils/uuidUtils.ts"

import { nuyenReducer } from "./nuyen.state.ts"

describe.concurrent("nuyenReducer", () => {
  it("credits an Item's sale price", () => {
    // Arrange
    const state = { current: 1000, loans: [] }

    // Act
    const next = nuyenReducer(state, sellItem({ id: crypto.randomUUID() as UUID, salePrice: 250, sellAttachments: true }))

    // Assert
    expect(next.current).toBe(1250)
  })
})
