import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { CharacterSheet } from "#/system/characterSheet.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementLanguageSkillList } from "./improvementLanguageSkillList.tsx"
import { SpendKarmaDialogProvider } from "./spendKarmaDialogContext.tsx"

function renderList(updateCharacterSheet?: (sheet: CharacterSheet) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementLanguageSkillList />
    </SpendKarmaDialogProvider>,
    { updateCharacterSheet },
  )
}

describe("ImprovementLanguageSkillList", () => {
  it("shows an empty state when the character has no language skills", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.languageSkills = []
    })

    // Act — nothing

    // Assert
    expect(screen.getByText(/no language skills/i)).toBeTruthy()
  })

  it("renders language skills with an Improve button", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.languageSkills = [{ name: "Sperethiel", rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Sperethiel")).toBeTruthy()
    expect(screen.getByRole("button", { name: /improve rating/i })).toBeTruthy()
  })

  it("shows Native chip and disables Improve button for native-rated language skills", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.languageSkills = [{ name: "Sperethiel", rating: "native" }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getAllByText("Native").length).toBeGreaterThan(0)
    const improveButton = screen.getByRole("button", { name: /improve rating/i })
    expect(improveButton.getAttribute("aria-disabled")).toBe("true")
  })

  it("shows Max chip and disables Improve button for language skills at rating 6", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.languageSkills = [{ name: "Sperethiel", rating: 6 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Max")).toBeTruthy()
    const improveButton = screen.getByRole("button", { name: /improve rating/i })
    expect(improveButton.getAttribute("aria-disabled")).toBe("true")
  })

  it("clicking Improve queues a language skill increase (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.languageSkills = [{ name: "Sperethiel", rating: 3 }]
      sheet.karma.current = 50
    })
    const improveButton = screen.getByRole("button", { name: /improve rating/i })

    // Act
    fireEvent.click(improveButton)

    // Assert
    expect(improveButton.getAttribute("aria-pressed")).toBe("true")
  })
})
