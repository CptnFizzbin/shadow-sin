import { describe, expect, it } from "vitest"

import { recordLastExport } from "./metaSlice.actions.ts"
import { metaReducer } from "./metaSlice.ts"

describe.concurrent("recordLastExport", () => {
  it("sets lastExportDate to the given timestamp", () => {
    // Arrange
    const state = metaReducer(undefined, { type: "@@INIT" })

    // Act
    const next = metaReducer(state, recordLastExport("2026-08-12T00:00:00.000Z"))

    // Assert
    expect(next.lastExportDate).toBe("2026-08-12T00:00:00.000Z")
  })

  it("overwrites a previously recorded export date", () => {
    // Arrange
    const state = metaReducer(undefined, recordLastExport("2026-08-01T00:00:00.000Z"))

    // Act
    const next = metaReducer(state, recordLastExport("2026-08-12T00:00:00.000Z"))

    // Assert
    expect(next.lastExportDate).toBe("2026-08-12T00:00:00.000Z")
  })
})
