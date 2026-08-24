import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ItemType } from "#/system/itemType.ts"

import { useDeviceForm } from "./useDeviceForm.tsx"

describe("useDeviceForm", () => {
  it("always defaults to ItemType.device", () => {
    const { result } = renderHook(() => useDeviceForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toBe(ItemType.device)
  })
})
