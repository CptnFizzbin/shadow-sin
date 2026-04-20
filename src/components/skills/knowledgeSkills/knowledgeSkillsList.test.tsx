import { ThemeProvider } from "@mui/material/styles"
import { render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import { KnowledgeSkillsList } from "#/components/skills/knowledgeSkills/knowledgeSkillsList.tsx"
import type { CharacterSheet } from "#/system/characterSheet.ts"
import { theme } from "#/theme.ts"

interface TestProvidersProps extends PropsWithChildren {
  characterSheet: CharacterSheet
}

const TestProviders: FC<TestProvidersProps> = ({ characterSheet, children }) => {
  const store = new CharacterSheetStore(characterSheet)

  return (
    <ThemeProvider theme={theme}>
      <CharacterSheetProvider store={store}>{children}</CharacterSheetProvider>
    </ThemeProvider>
  )
}

function renderWithCharacter(
  element: ReactElement,
  updateCharacterSheet?: (characterSheet: CharacterSheet) => void,
) {
  const characterSheet = createDefaultCharacterSheet()
  updateCharacterSheet?.(characterSheet)

  return render(element, {
    wrapper: ({ children }) => {
      return <TestProviders characterSheet={characterSheet}>{children}</TestProviders>
    },
  })
}

describe("KnowledgeSkillsList", () => {
  it("renders skills with name, rating, and optional specialization", () => {
    renderWithCharacter(<KnowledgeSkillsList />, (characterSheet) => {
      characterSheet.skills.knowledgeSkills = [
        { name: "Seattle Street Rumors", rating: 3, specialization: "Redmond" },
        { name: "Ancient History", rating: 4 },
      ]
    })

    expect(screen.getByText("Knowledge Skills")).toBeTruthy()
    expect(screen.getByText("Ancient History")).toBeTruthy()
    expect(screen.getByText("Seattle Street Rumors")).toBeTruthy()
    expect(screen.getByText("Redmond")).toBeTruthy()
    expect(screen.getAllByText("4").length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText("3").length).toBeGreaterThanOrEqual(1)
  })

  it("renders an empty state when no knowledge skills exist", () => {
    renderWithCharacter(<KnowledgeSkillsList />)

    expect(screen.getByText("No knowledge skills added")).toBeTruthy()
  })
})
