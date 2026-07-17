import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SpendKarmaDialogProvider } from "#/components/improvements/spendKarmaDialogContext.tsx"
import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import type { RunnerData } from "#/system/runnerData.ts"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { ImprovementKnowledgeSkillList } from "./improvementKnowledgeSkillList.tsx"

function renderList(updateRunnerData?: (sheet: RunnerData) => void) {
  return renderWithProviders(
    <SpendKarmaDialogProvider>
      <ImprovementKnowledgeSkillList />
    </SpendKarmaDialogProvider>,
    {
      runnerStore: new RunnerDataStore(runnerDataFactory((sheet) => {
        updateRunnerData?.(sheet)
        return sheet
      })),
    },
  )
}

describe("ImprovementKnowledgeSkillList", () => {
  it("shows an empty state when the runner has no knowledge skills", () => {
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

  it("shows Max chip and disables Improve button for skills at rating 6", () => {
    // Arrange
    renderList((sheet) => {
      sheet.skills.knowledgeSkills = [{ name: "Ancient History", rating: 6 }]
      sheet.karma.current = 50
    })

    // Act — nothing

    // Assert
    expect(screen.getByText("Max")).toBeTruthy()
    const improveButton = screen.getByRole("button", { name: /improve rating/i })
    expect(improveButton.getAttribute("aria-disabled")).toBe("true")
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
