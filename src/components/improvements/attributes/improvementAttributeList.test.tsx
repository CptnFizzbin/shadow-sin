import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { SpendKarmaDialogProvider } from "#/contexts/improvements/spendKarmaDialogContext.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementAttributeList } from "./improvementAttributeList.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementAttributeList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory({ afterBuild: (sheet) => {
        updateRunnerData?.(sheet)
      } })),
    },
  )
}

describe("ImprovementAttributeList", () => {
  it("renders attributes using their abbreviated labels", () => {
    // Arrange
    renderList((sheet) => {
      sheet.attributes[AttributeKey.body] = 3
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getAllByText("BOD").length).toBeGreaterThan(0)
  })

  it("shows a Max chip for attributes at the racial maximum", () => {
    // Arrange — Human Body max = 6
    renderList((sheet) => {
      sheet.attributes[AttributeKey.body] = 6
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Max")).toBeTruthy()
  })

  it("disables the attribute row button for maxed attributes", () => {
    // Arrange — Human Body max = 6
    renderList((sheet) => {
      sheet.attributes[AttributeKey.body] = 6
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert — maxed attribute button should be disabled
    const bodRow = screen.getByRole("button", { name: /bod/i })
    expect(bodRow.getAttribute("aria-disabled")).toBe("true")
  })

  it("clicking an affordable attribute queues it (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.attributes[AttributeKey.body] = 3
      sheet.karma.current = 50
    })
    const bodButton = screen.getByRole("button", { name: /bod/i }) as HTMLButtonElement

    // Act
    fireEvent.click(bodButton)

    // Assert
    expect(bodButton.getAttribute("aria-pressed")).toBe("true")
  })

  it("clicking a queued attribute dequeues it (aria-pressed returns to false)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.attributes[AttributeKey.body] = 3
      sheet.karma.current = 50
    })
    const bodButton = screen.getByRole("button", { name: /bod/i }) as HTMLButtonElement
    fireEvent.click(bodButton) // queue

    // Act
    fireEvent.click(bodButton) // dequeue

    // Assert
    expect(bodButton.getAttribute("aria-pressed")).toBe("false")
  })
})
