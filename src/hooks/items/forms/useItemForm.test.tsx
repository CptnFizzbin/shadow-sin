import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { createItem } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

import { itemDefaults, useItemForm } from "./useItemForm.tsx"

describe("useItemForm", () => {
  it("defaults to ItemType.other when no itemType is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({ defaultValues: itemDefaults, onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.other)
  })

  it("uses ItemType.vehicle when itemType=vehicle is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({
        defaultValues: { ...itemDefaults, itemType: ItemType.vehicle },
        onSubmit: vi.fn(),
      }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.vehicle)
  })

  it("uses ItemType.armor when itemType=armor is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({
        defaultValues: { ...itemDefaults, itemType: ItemType.armor },
        onSubmit: vi.fn(),
      }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.armor)
  })

  it("preserves the existing item's itemType when editing", () => {
    const [existingItem] = createItem({
      itemType: ItemType.vehicle,
      name: "Eurocar Westwind 2000",
      cost: 65000,
    })
    const { result } = renderHook(() =>
      useItemForm({ item: existingItem, defaultValues: itemDefaults, onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.vehicle)
  })
})
