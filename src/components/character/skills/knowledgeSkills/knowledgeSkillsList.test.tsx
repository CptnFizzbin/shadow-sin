import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { KnowledgeSkillsList } from "#/components/character/skills/knowledgeSkills/knowledgeSkillsList.tsx"
import { renderWithProviders } from "#testUtils/renderUtils.tsx"

describe("KnowledgeSkillsList", () => {
  it("renders skills with name, rating, and optional specialization", () => {
    renderWithProviders(<KnowledgeSkillsList />, {
      updateCharacterSheet: (characterSheet) => {
        characterSheet.skills.knowledgeSkills = [
          { name: "Seattle Street Rumors", rating: 3, specialization: "Redmond" },
          { name: "Ancient History", rating: 4 },
        ]
      },
    })

    expect(screen.getByText("Knowledge Skills")).toBeTruthy()
    expect(screen.getByText("Ancient History")).toBeTruthy()
    expect(screen.getByText("Seattle Street Rumors")).toBeTruthy()
    expect(screen.getByText("Redmond")).toBeTruthy()
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1)
  })

  it("renders an empty state when no knowledge skills exist", () => {
    renderWithProviders(<KnowledgeSkillsList />)

    expect(screen.getByText("No knowledge skills added")).toBeTruthy()
  })
})
