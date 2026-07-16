import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementQualityList } from "./improvementQualityList.tsx"
import { SpendKarmaDialogProvider } from "./spendKarmaDialogContext.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementQualityList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory((sheet) => {
        updateRunnerData?.(sheet)
        return sheet
      })),
    },
  )
}

describe("ImprovementQualityList", () => {
  it("shows a GM-approval notice", () => {
    // Arrange
    renderList()

    // Act — nothing

    // Assert
    expect(screen.getByText(/approved by your gm/i)).toBeTruthy()
  })

  it("shows a message when there are no negative qualities to buy off", () => {
    // Arrange
    renderList((sheet) => {
      sheet.qualities = []
    })

    // Act — nothing

    // Assert
    expect(screen.getByText(/no negative qualities to buy off/i)).toBeTruthy()
  })

  it("lists existing negative qualities as buy-off candidates", () => {
    // Arrange
    renderList((sheet) => {
      sheet.qualities = [
        { id: "00000000-0000-0000-0000-000000000001", name: "Uneducated", type: "negative", bpValue: 20 },
      ]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Uneducated")).toBeTruthy()
  })

  it("does not list positive qualities as buy-off candidates", () => {
    // Arrange
    renderList((sheet) => {
      sheet.qualities = [
        { id: "00000000-0000-0000-0000-000000000001", name: "Toughness", type: "positive", bpValue: 15 },
      ]
    })

    // Act — nothing

    // Assert
    expect(screen.queryByText("Toughness")).toBeNull()
  })

  it("clicking a negative quality queues its buy-off (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.qualities = [
        { id: "00000000-0000-0000-0000-000000000001", name: "Uneducated", type: "negative", bpValue: 20 },
      ]
      sheet.karma.current = 50
    })
    const buyOffButton = screen.getByRole("button", { name: /uneducated/i }) as HTMLButtonElement

    // Act
    fireEvent.click(buyOffButton)

    // Assert
    expect(buyOffButton.getAttribute("aria-pressed")).toBe("true")
  })

  it("exposes an Add Quality button", () => {
    // Arrange
    renderList()

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /add quality/i })).toBeTruthy()
  })
})
