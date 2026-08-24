import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { SpendKarmaDialogProvider } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementSubmersionList } from "./improvementSubmersionList.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementSubmersionList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory((sheet) => {
        updateRunnerData?.(sheet)
        return sheet
      })),
    },
  )
}

describe("ImprovementSubmersionList", () => {
  it("shows the current grade and the next grade it would raise to", () => {
    // Arrange
    renderList((sheet) => {
      sheet.submersionGrade = 1
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("1 → 2")).toBeTruthy()
  })

  it("shows a not-yet-supported notice for Echo selection", () => {
    // Arrange
    renderList()

    // Act — nothing

    // Assert
    expect(screen.getByText(/echoes coming soon/i)).toBeTruthy()
  })

  it("clicking the row queues the grade raise (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.karma.current = 50
    })
    const gradeButton = screen.getByRole("button", { name: /submersion grade/i }) as HTMLButtonElement

    // Act
    fireEvent.click(gradeButton)

    // Assert
    expect(gradeButton.getAttribute("aria-pressed")).toBe("true")
  })
})
