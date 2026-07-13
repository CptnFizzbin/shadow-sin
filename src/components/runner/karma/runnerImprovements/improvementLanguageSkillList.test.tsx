import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementLanguageSkillList } from "./improvementLanguageSkillList.tsx"
import { SpendKarmaDialogProvider } from "./spendKarmaDialogContext.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementLanguageSkillList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory((sheet) => {
        updateRunnerData?.(sheet)
        return sheet
      })),
    },
  )
}

describe("ImprovementLanguageSkillList", () => {
  it("shows an empty state when the runner has no language skills", () => {
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

  it("exposes an Add lingo button for each language skill", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.languageSkills = [{ name: "Sperethiel", rating: 3 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByRole("button", { name: /add lingo/i })).toBeTruthy()
  })

  it("clicking Add lingo opens the picker dialog titled with 'Lingo'", async () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.languageSkills = [{ name: "Sperethiel", rating: 3 }]
      sheet.karma.current = 50
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add lingo/i }))

    // Assert
    expect(await screen.findByText(/lingo\s*[—-]\s*Sperethiel/i)).toBeTruthy()
  })

  it("allows queuing a lingo for a native language", async () => {
    // Arrange — natives can't be improved, but they CAN get a lingo
    renderList((sheet) => {
      sheet.skills.languageSkills = [{ name: "English", rating: "native" }]
      sheet.karma.current = 50
    })

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add lingo/i }))

    // Assert — dialog appears
    expect(await screen.findByText(/lingo\s*[—-]\s*English/i)).toBeTruthy()
  })
})
