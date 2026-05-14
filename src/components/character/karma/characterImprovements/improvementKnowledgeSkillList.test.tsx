import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { CharacterSheet } from "#/system/characterSheet.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementKnowledgeSkillList } from "./improvementKnowledgeSkillList.tsx"
import { SpendKarmaDialogProvider } from "./spendKarmaDialogContext.tsx"

function renderList(updateCharacterSheet?: (sheet: CharacterSheet) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementKnowledgeSkillList />
    </SpendKarmaDialogProvider>,
    { updateCharacterSheet },
  )
}

describe("ImprovementKnowledgeSkillList", () => {
  it("shows an empty state when the character has no knowledge skills", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = []
    })

    // Act — nothing

    // Assert
    expect(screen.getByText(/no knowledge skills/i)).toBeTruthy()
  })

  it("renders knowledge skills with Improve button", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Ancient History")).toBeTruthy()
    expect(screen.getByRole("button", { name: /improve rating/i })).toBeTruthy()
  })

  it("shows Max chip and no Improve button for skills at rating 6", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 6 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Max")).toBeTruthy()
    expect(screen.queryByRole("button", { name: /improve rating/i })).toBeNull()
  })

  it("clicking Improve queues a knowledge skill increase (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 3 }]
      sheet.karma.current = 50
    })
    const improveButton = screen.getByRole("button", { name: /improve rating/i })

    // Act
    fireEvent.click(improveButton)

    // Assert
    expect(improveButton.getAttribute("aria-pressed")).toBe("true")
  })

  it("clicking Improve again dequeues the knowledge skill increase", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 3 }]
      sheet.karma.current = 50
    })
    const improveButton = screen.getByRole("button", { name: /improve rating/i })
    fireEvent.click(improveButton) // queue

    // Act
    fireEvent.click(improveButton) // dequeue

    // Assert
    expect(improveButton.getAttribute("aria-pressed")).toBe("false")
  })
})
