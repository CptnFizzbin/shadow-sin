import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"

import { MetaSelectors } from "./metaSlice.selectors.ts"

const stateFor = (runner: RunnerData) => ({ runner })

describe.concurrent("MetaSelectors.selectLastExportDate", () => {
  it("returns null when the runner has never been exported", () => {
    // Arrange
    const runnerData = runnerDataFactory()

    // Act
    const result = MetaSelectors.selectLastExportDate(stateFor(runnerData))

    // Assert
    expect(result).toBeNull()
  })

  it("returns the recorded export timestamp", () => {
    // Arrange
    const runnerData = runnerDataFactory({ afterBuild: (data) => {
      data._meta_.lastExportDate = "2026-08-12T00:00:00.000Z"
    } })

    // Act
    const result = MetaSelectors.selectLastExportDate(stateFor(runnerData))

    // Assert
    expect(result).toBe("2026-08-12T00:00:00.000Z")
  })
})
