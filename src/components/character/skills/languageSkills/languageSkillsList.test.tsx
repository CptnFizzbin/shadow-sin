import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderWithProviders } from "#testUtils/renderUtils.tsx"

import { LanguageSkillsList } from "./languageSkillsList.tsx"

describe("LanguageSkillsList", () => {
  it("renders skills with native badge and lingo label", () => {
    renderWithProviders(<LanguageSkillsList />, {
      updateCharacterSheet: (characterSheet) => {
        characterSheet.skills.languageSkills = [
          { name: "Sperethiel", rating: "native" },
          { name: "English", rating: 5, lingo: "Seattle Sprawl" },
        ]
      },
    })

    expect(screen.getByText("Languages")).toBeTruthy()
    expect(screen.getByText("Sperethiel")).toBeTruthy()
    expect(screen.getByText("English")).toBeTruthy()
    expect(screen.getByText("Seattle Sprawl")).toBeTruthy()
    expect(screen.getAllByText("INT")).toHaveLength(2)
    expect(screen.queryByText("LOG")).toBeNull()
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1)
  })

  it("renders an empty state when no language skills exist", () => {
    renderWithProviders(<LanguageSkillsList />)

    expect(screen.getByText("No language skills added")).toBeTruthy()
  })
})
