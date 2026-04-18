import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useWeaponForm } from "#/components/gear/weapons/forms/useWeaponForm.tsx"
import { ItemType } from "#/lib/system/itemType.ts"

describe("useWeaponForm", () => {
  it("always defaults to ItemType.weapon", () => {
    const { result } = renderHook(() => useWeaponForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toBe(ItemType.weapon)
  })
})
