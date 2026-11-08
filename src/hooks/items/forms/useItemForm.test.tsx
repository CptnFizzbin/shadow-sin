import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityKind } from "#/system/model/entities/entityKind.ts"
import type { ItemData } from "#/system/model/items/itemData.ts"
import { createItem } from "#/system/model/items/itemData.ts"
import { ItemType } from "#/system/model/items/itemType.ts"

import { itemDefaults, useItemForm } from "./useItemForm.tsx"

describe("useItemForm", () => {
  it("starts from defaultValues unchanged (ItemType.other) when no item is provided", () => {
    // Arrange
    const defaultValues = { ...itemDefaults }

    // Act
    const { result } = renderHook(() =>
      useItemForm({ defaultValues, onSubmit: vi.fn() }),
    )

    // Assert
    expect(result.current.state.values).toEqual(itemDefaults)
    expect(result.current.state.values.itemType).toBe(ItemType.other)
  })

  it("overlays an existing item on defaultValues, falling back to the default quantity when the item has none", () => {
    // Arrange
    const existingItem: ItemData = {
      kind: EntityKind.item,
      id: "00000000-0000-0000-0000-000000000042",
      itemType: ItemType.vehicle,
      name: "Eurocar Westwind 2000",
      cost: 65000,
      quantity: undefined,
      items: { parentId: null, childIds: [] },
    }
    const defaultValues = { ...itemDefaults, quantity: 2, description: "Default description" }

    // Act
    const { result } = renderHook(() =>
      useItemForm({ item: existingItem, defaultValues, onSubmit: vi.fn() }),
    )

    // Assert
    expect(result.current.state.values).toMatchObject({
      id: "00000000-0000-0000-0000-000000000042",
      itemType: ItemType.vehicle,
      name: "Eurocar Westwind 2000",
      cost: 65000,
      quantity: 2,
      description: "Default description",
    })
  })

  it("uses ItemType.armor when itemType=armor is provided", () => {
    // Arrange
    const defaultValues = { ...itemDefaults, itemType: ItemType.armor }

    // Act
    const { result } = renderHook(() =>
      useItemForm({ defaultValues, onSubmit: vi.fn() }),
    )

    // Assert
    expect(result.current.state.values.itemType).toBe(ItemType.armor)
  })

  it("preserves the existing item's itemType when editing", () => {
    // Arrange
    const [existingItem] = createItem({
      itemType: ItemType.vehicle,
      name: "Eurocar Westwind 2000",
      cost: 65000,
    })

    // Act
    const { result } = renderHook(() =>
      useItemForm({ item: existingItem, defaultValues: itemDefaults, onSubmit: vi.fn() }),
    )

    // Assert
    expect(result.current.state.values.itemType).toBe(ItemType.vehicle)
  })
})
