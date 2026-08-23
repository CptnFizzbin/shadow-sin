import { fireEvent, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { renderWithRunner } from "#testUtils/renderWithRunner.tsx"

import type * as ExportUtils from "./exportUtils.ts"
import { downloadTextFile, yamlToRunnerData } from "./exportUtils.ts"

vi.mock("./exportUtils.ts", async (importOriginal) => {
  const actual = await importOriginal<typeof ExportUtils>()
  return { ...actual, downloadTextFile: vi.fn() }
})

describe("ExportRunnerButton", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-08-12T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.mocked(downloadTextFile).mockClear()
  })

  it("downloads the runner as `<name>.<isoDate>.sin`", () => {
    // Arrange
    renderWithRunner((data) => {
      data.profile.alias = "Artemis"
      return data
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Export" }))

    // Assert
    expect(downloadTextFile).toHaveBeenCalledWith(
      expect.any(String),
      "artemis.2026-08-12.sin",
    )
  })

  it("records the export timestamp on the runner's meta", () => {
    // Arrange
    const store = renderWithRunner()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Export" }))

    // Assert
    expect(store.getState()._meta_.lastExportDate).toBe("2026-08-12T12:00:00.000Z")
  })

  it("bakes the export timestamp into the exported file itself", () => {
    // Arrange
    renderWithRunner()

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Export" }))

    // Assert
    const [yamlContent] = vi.mocked(downloadTextFile).mock.calls[0]
    expect(yamlToRunnerData(yamlContent)._meta_.lastExportDate).toBe("2026-08-12T12:00:00.000Z")
  })
})
