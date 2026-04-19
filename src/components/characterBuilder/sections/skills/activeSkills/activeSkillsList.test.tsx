import { ThemeProvider } from "@mui/material/styles"
import { Store } from "@tanstack/store"
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import type { BuilderRootState } from "#/components/characterBuilder/builderRootState.ts"
import { CharacterBuilderStoreProvider } from "#/components/characterBuilder/characterBuilderStoreProvider.tsx"
import { ActiveSkillsList } from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillsList.tsx"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"
import { theme } from "#/theme.ts"

describe("ActiveSkillsList", () => {
  it("editing the second skill updates that skill and not the first one", async () => {
    // Arrange
    const firstSkill = { name: SkillKey.pistols, rating: 3 }
    const secondSkill = { name: SkillKey.automatics, rating: 4 }

    const rootStore = new Store<BuilderRootState>({
      character: {
        ...createDefaultCharacterSheet(),
        skills: {
          ...createDefaultCharacterSheet().skills,
          activeSkills: [firstSkill, secondSkill],
        },
      },
      builder: { startingNuyen: undefined },
    })

    const Wrapper: FC<PropsWithChildren> = ({ children }) => (
      <ThemeProvider theme={theme}>
        <CharacterBuilderStoreProvider rootStore={rootStore}>
          {children}
        </CharacterBuilderStoreProvider>
      </ThemeProvider>
    )

    render(<ActiveSkillsList />, { wrapper: Wrapper })

    // Act — click on the second skill (Automatics) to open the edit dialog
    fireEvent.click(screen.getByText(SkillKey.automatics))

    // Wait for dialog to appear
    let dialog: HTMLElement
    await waitFor(() => {
      dialog = screen.getByRole("dialog")
      expect(dialog).toBeTruthy()
    })

    // Click Save without changes
    const saveButton = within(dialog!).getByRole("button", { name: /save/i })
    fireEvent.click(saveButton)

    // Assert — both skills should remain in their original positions and values
    await waitFor(() => {
      const updatedSkills = rootStore.state.character.skills.activeSkills
      expect(updatedSkills).toHaveLength(2)
      expect(updatedSkills[0].name).toBe(SkillKey.pistols)
      expect(updatedSkills[0].rating).toBe(3)
      expect(updatedSkills[1].name).toBe(SkillKey.automatics)
      expect(updatedSkills[1].rating).toBe(4)
    })
  })
})
