import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ItemType } from "#/system/itemType.ts"

import { useImplantForm } from "./useImplantForm.tsx"

describe("useImplantForm", () => {
  it("always defaults to ItemType.implant", () => {
    const { result } = renderHook(() => useImplantForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toEqual([ItemType.implant])
  })
})
