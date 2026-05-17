import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ItemType } from "#/system/itemType.ts"

import { useWeaponForm } from "./useWeaponForm.tsx"

describe("useWeaponForm", () => {
  it("always defaults to ItemType.weapon", () => {
    const { result } = renderHook(() => useWeaponForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toEqual([ItemType.weapon])
  })
})
