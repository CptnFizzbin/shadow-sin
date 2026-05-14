import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { CharacterSheet } from "#/system/characterSheet.ts"
import { SkillGroupKey } from "#/system/skills/skillGroupKey.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementActiveSkillList } from "./improvementActiveSkillList.tsx"
import { SpendKarmaDialogProvider } from "./spendKarmaDialogContext.tsx"

function renderList(updateCharacterSheet?: (sheet: CharacterSheet) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementActiveSkillList />
    </SpendKarmaDialogProvider>,
    { updateCharacterSheet },
  )
}

describe("ImprovementActiveSkillList", () => {
  it("renders standalone active skills with Improve and Spec buttons", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.skills.skillGroups = []
      sheet.karma.current = 50
    })

    // Act — nothing to trigger

    // Assert
    expect(screen.getByText("Pistols")).toBeTruthy()
    expect(screen.getByRole("button", { name: /improve rating/i })).toBeTruthy()
    expect(screen.getByRole("button", { name: /add specialization/i })).toBeTruthy()
  })

  it("shows skills from skill groups with a ⚠ warning indicator", () => {
    // Arrange — Pistols belongs to the Firearms group
    renderList((sheet) => {
      sheet.skills.activeSkills = []
      sheet.skills.skillGroups = [{ name: SkillGroupKey.Firearms, rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Pistols")).toBeTruthy()
    expect(screen.getAllByText("⚠").length).toBeGreaterThan(0)
  })

  it("shows Max chip and no Improve button for skills at maximum rating (6)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 6 }]
      sheet.skills.skillGroups = []
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Max")).toBeTruthy()
    expect(screen.queryByRole("button", { name: /improve rating/i })).toBeNull()
  })

  it("clicking Improve queues a skill increase (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.skills.skillGroups = []
      sheet.karma.current = 50
    })
    const improveButton = screen.getByRole("button", { name: /improve rating/i })

    // Act
    fireEvent.click(improveButton)

    // Assert
    expect(improveButton.getAttribute("aria-pressed")).toBe("true")
  })

  it("clicking Improve again dequeues the skill increase", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.skills.skillGroups = []
      sheet.karma.current = 50
    })
    const improveButton = screen.getByRole("button", { name: /improve rating/i })
    fireEvent.click(improveButton) // queue

    // Act
    fireEvent.click(improveButton) // dequeue

    // Assert
    expect(improveButton.getAttribute("aria-pressed")).toBe("false")
  })

  it("clicking Spec queues a specialization (button becomes aria-pressed)", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.skills.skillGroups = []
      sheet.karma.current = 50
    })
    const specButton = screen.getByRole("button", { name: /add specialization/i })

    // Act
    fireEvent.click(specButton)

    // Assert
    expect(specButton.getAttribute("aria-pressed")).toBe("true")
  })

  it("disables the Improve button when the character cannot afford it", () => {
    // Arrange — rating 3 costs (3+1)*2 = 8k, but 0 karma available
    renderList((sheet) => {
      sheet.skills.activeSkills = [{ name: SkillKey.pistols, rating: 3 }]
      sheet.skills.skillGroups = []
      sheet.karma.current = 0
    })

    // Act — nothing

    // Assert
    const improveButton = screen.getByRole("button", { name: /improve rating/i })
    expect((improveButton as HTMLButtonElement).disabled).toBe(true)
  })
})
