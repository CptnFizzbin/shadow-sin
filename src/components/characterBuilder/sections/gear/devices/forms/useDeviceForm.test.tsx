import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { useDeviceForm } from "#/components/characterBuilder/sections/gear/devices/forms/useDeviceForm.tsx"
import { ItemType } from "#/lib/system/itemType.ts"

describe("useDeviceForm", () => {
  it("always defaults to ItemType.device", () => {
    const { result } = renderHook(() => useDeviceForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toBe(ItemType.device)
  })
})
