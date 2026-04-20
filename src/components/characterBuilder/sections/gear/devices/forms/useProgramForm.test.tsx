import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useProgramForm } from "#/components/characterBuilder/sections/gear/devices/forms/useProgramForm.tsx"
import { ItemType } from "#/system/itemType.ts"

describe("useProgramForm", () => {
  it("always defaults to ItemType.program", () => {
    const { result } = renderHook(() => useProgramForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toBe(ItemType.program)
  })
})
