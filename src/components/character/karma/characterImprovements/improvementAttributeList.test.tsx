import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AttributeKey } from "#/system/attributeKey.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementAttributeList } from "./improvementAttributeList.tsx"
import { SpendKarmaDialogProvider } from "./spendKarmaDialogContext.tsx"

function renderList(updateCharacterSheet?: (sheet: CharacterSheet) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementAttributeList />
    </SpendKarmaDialogProvider>,
    { updateCharacterSheet },
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
    const bodRow = screen.getAllByText("BOD")[0].closest("button") as HTMLButtonElement | null
    expect(bodRow?.disabled).toBe(true)
  })

  it("clicking an affordable attribute queues it (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.attributes[AttributeKey.body] = 3
      sheet.karma.current = 50
    })
    const bodButton = screen.getAllByText("BOD")[0].closest("button") as HTMLButtonElement

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
    const bodButton = screen.getAllByText("BOD")[0].closest("button") as HTMLButtonElement
    fireEvent.click(bodButton) // queue

    // Act
    fireEvent.click(bodButton) // dequeue

    // Assert
    expect(bodButton.getAttribute("aria-pressed")).toBe("false")
  })
})
