import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { gearItemDefaults, useItemForm } from "#/components/gear/forms/useItemForm.tsx"
import { createItem } from "#/system/itemData.ts"
import { ItemType } from "#/system/itemType.ts"

describe("useItemForm", () => {
  it("defaults to ItemType.other when no itemType is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({ defaultValues: gearItemDefaults, onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.other)
  })

  it("uses ItemType.vehicle when itemType=vehicle is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({
        defaultValues: { ...gearItemDefaults, itemType: ItemType.vehicle },
        onSubmit: vi.fn(),
      }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.vehicle)
  })

  it("uses ItemType.armor when itemType=armor is provided", () => {
    const { result } = renderHook(() =>
      useItemForm({
        defaultValues: { ...gearItemDefaults, itemType: ItemType.armor },
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
      useItemForm({ item: existingItem, defaultValues: gearItemDefaults, onSubmit: vi.fn() }),
    )
    expect(result.current.state.values.itemType).toBe(ItemType.vehicle)
  })
})
