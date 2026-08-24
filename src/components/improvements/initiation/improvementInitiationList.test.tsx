import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { SpendKarmaDialogProvider } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementInitiationList } from "./improvementInitiationList.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementInitiationList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory({ override: (sheet) => {
        updateRunnerData?.(sheet)
        return sheet
      } })),
    },
  )
}

describe("ImprovementInitiationList", () => {
  it("shows the current grade and the next grade it would raise to", () => {
    // Arrange
    renderList((sheet) => {
      sheet.initiateGrade = 2
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("2 → 3")).toBeTruthy()
  })

  it("shows a not-yet-supported notice for metamagic selection", () => {
    // Arrange
    renderList()

    // Act — nothing

    // Assert
    expect(screen.getByText(/metamagics coming soon/i)).toBeTruthy()
  })

  it("clicking the row queues the grade raise (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.karma.current = 50
    })
    const gradeButton = screen.getByRole("button", { name: /initiate grade/i }) as HTMLButtonElement

    // Act
    fireEvent.click(gradeButton)

    // Assert
    expect(gradeButton.getAttribute("aria-pressed")).toBe("true")
  })

  it("disables the row when the raise cannot be afforded", () => {
    // Arrange — grade 0 → 1 costs 13, only 5 karma available
    renderList((sheet) => {
      sheet.karma.current = 5
    })

    // Act — nothing

    // Assert
    const gradeButton = screen.getByRole("button", { name: /initiate grade/i })
    expect(gradeButton.getAttribute("aria-disabled")).toBe("true")
  })
})
