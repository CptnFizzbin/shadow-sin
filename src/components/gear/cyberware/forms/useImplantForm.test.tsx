import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useImplantForm } from "#/components/gear/cyberware/forms/useImplantForm.tsx"
import { ItemType } from "#/lib/system/itemType.ts"

describe("useImplantForm", () => {
  it("always defaults to ItemType.implant", () => {
    const { result } = renderHook(() => useImplantForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toBe(ItemType.implant)
  })
})
