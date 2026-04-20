import { ThemeProvider } from "@mui/material/styles"
import { render, screen } from "@testing-library/react"
import type { FC, PropsWithChildren, ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { CharacterSheetProvider } from "#/components/character/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/characterSheetStore.ts"
import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import { LanguageSkillsList } from "#/components/skills/languageSkills/languageSkillsList.tsx"
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

describe("LanguageSkillsList", () => {
  it("renders skills with native badge and lingo label", () => {
    renderWithCharacter(<LanguageSkillsList />, (characterSheet) => {
      characterSheet.skills.languageSkills = [
        { name: "Sperethiel", rating: "native" },
        { name: "English", rating: 5, lingo: "Seattle Sprawl" },
      ]
    })

    expect(screen.getByText("Languages")).toBeTruthy()
    expect(screen.getByText("Sperethiel")).toBeTruthy()
    expect(screen.getByText("English")).toBeTruthy()
    expect(screen.getByText("Seattle Sprawl")).toBeTruthy()
    expect(screen.getAllByText("5").length).toBeGreaterThanOrEqual(1)
  })

  it("renders an empty state when no language skills exist", () => {
    renderWithCharacter(<LanguageSkillsList />)

    expect(screen.getByText("No language skills added")).toBeTruthy()
  })
})
