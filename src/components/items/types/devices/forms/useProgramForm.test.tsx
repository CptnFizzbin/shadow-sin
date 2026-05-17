import { renderHook } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ItemType } from "#/system/itemType.ts"

import { useProgramForm } from "./useProgramForm.tsx"

describe("useProgramForm", () => {
  it("always defaults to ItemType.program", () => {
    const { result } = renderHook(() => useProgramForm({ onSubmit: vi.fn() }))
    expect(result.current.state.values.itemType).toEqual([ItemType.program])
  })
})
