import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useImplantForm } from "#/components/implants/forms/useImplantForm.tsx"
import { ItemType } from "#/system/itemType.ts"

describe("useImplantForm", () => {
  it("always defaults to ItemType.implant", () => {
    const { result } = renderHook(() => useImplantForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toBe(ItemType.implant)
  })
})
