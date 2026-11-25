import { describe, expect, it } from "vitest"

import type { UUID } from "#/common/uuid/uuidUtils.ts"

import { createItemSelectionStore, ItemSelectionActions } from "./itemSelectionStore.ts"

const rifleId = "rifle" as UUID
const scopeId = "scope" as UUID
const armorId = "armor" as UUID

describe.concurrent("itemSelectionStore", () => {
  it("starts with selection mode off and nothing selected", () => {
    // Arrange / Act
    const store = createItemSelectionStore()

    // Assert
    expect(store.getState()).toEqual({ isSelecting: false, selectedIds: [] })
  })

  it("selecting a parent also selects its Attachments", () => {
    // Arrange
    const store = createItemSelectionStore()
    store.dispatch(ItemSelectionActions.start())

    // Act
    store.dispatch(ItemSelectionActions.toggle({ itemId: rifleId, descendantIds: [scopeId] }))

    // Assert
    expect(store.getState().selectedIds).toEqual([rifleId, scopeId])
  })

  it("an auto-selected Attachment can be deselected on its own", () => {
    // Arrange
    const store = createItemSelectionStore()
    store.dispatch(ItemSelectionActions.start())
    store.dispatch(ItemSelectionActions.toggle({ itemId: rifleId, descendantIds: [scopeId] }))

    // Act
    store.dispatch(ItemSelectionActions.toggle({ itemId: scopeId, descendantIds: [] }))

    // Assert
    expect(store.getState().selectedIds).toEqual([rifleId])
  })

  it("deselecting a parent deselects its Attachments but keeps everything else", () => {
    // Arrange
    const store = createItemSelectionStore()
    store.dispatch(ItemSelectionActions.start())
    store.dispatch(ItemSelectionActions.toggle({ itemId: armorId, descendantIds: [] }))
    store.dispatch(ItemSelectionActions.toggle({ itemId: rifleId, descendantIds: [scopeId] }))

    // Act
    store.dispatch(ItemSelectionActions.toggle({ itemId: rifleId, descendantIds: [scopeId] }))

    // Assert
    expect(store.getState().selectedIds).toEqual([armorId])
  })

  it("exiting turns selection mode off and clears the selection", () => {
    // Arrange
    const store = createItemSelectionStore()
    store.dispatch(ItemSelectionActions.start())
    store.dispatch(ItemSelectionActions.toggle({ itemId: armorId, descendantIds: [] }))

    // Act
    store.dispatch(ItemSelectionActions.exit())

    // Assert
    expect(store.getState()).toEqual({ isSelecting: false, selectedIds: [] })
  })
})
