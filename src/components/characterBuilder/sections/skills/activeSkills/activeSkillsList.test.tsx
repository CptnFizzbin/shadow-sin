import { ThemeProvider } from "@mui/material/styles"
import { Store } from "@tanstack/store"
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { createDefaultCharacterSheet } from "#/components/character/createDefaultCharacterSheet.ts"
import type { BuilderRootState } from "#/components/characterBuilder/builderRootState.ts"
import { CharacterBuilderStoreProvider } from "#/components/characterBuilder/characterBuilderStoreProvider.tsx"
import { ActiveSkillsList } from "#/components/characterBuilder/sections/skills/activeSkills/activeSkillsList.tsx"
import { SkillKey } from "#/lib/system/skills/skillKey.ts"
import { theme } from "#/theme.ts"

interface WrapperProps extends PropsWithChildren {
  rootStore: Store<BuilderRootState>
}

const Wrapper: FC<WrapperProps> = ({ children, rootStore }) => (
  <ThemeProvider theme={theme}>
    <CharacterBuilderStoreProvider rootStore={rootStore}>
      {children}
    </CharacterBuilderStoreProvider>
  </ThemeProvider>
)

describe("ActiveSkillsList", () => {
  it("opening a second skill to edit after saving the first shows the second skill's data, not the first skill's", async () => {
    // Arrange
    const rootStore = new Store<BuilderRootState>({
      character: {
        ...createDefaultCharacterSheet(),
        skills: {
          ...createDefaultCharacterSheet().skills,
          activeSkills: [
            { name: SkillKey.pistols, rating: 3 },
            { name: SkillKey.automatics, rating: 4 },
          ],
        },
      },
      builder: { startingNuyen: undefined },
    })

    render(<ActiveSkillsList />, {
      wrapper: ({ children }) => <Wrapper rootStore={rootStore}>{children}</Wrapper>,
    })

    // Act — open Automatics, save it, then immediately open Pistols before the close
    // transition has a chance to call clearDialog (simulates rapid user interaction)
    fireEvent.click(screen.getByText(SkillKey.automatics))

    let firstDialog: HTMLElement
    await waitFor(() => {
      firstDialog = screen.getByRole("dialog")
      expect(firstDialog).toBeTruthy()
    })

    // Save Automatics: triggers closeDialog() but NOT clearDialog() (transition hasn't ended)
    act(() => {
      fireEvent.click(within(firstDialog!).getByRole("button", { name: /save/i }))
    })

    // Immediately open Pistols before the dialog transition completes
    fireEvent.click(screen.getByText(SkillKey.pistols))

    // Assert — the newly opened dialog must show Pistols, not the previously-saved Automatics
    await waitFor(() => {
      const dialog = screen.getByRole("dialog")
      // The skill Select in the dialog should display "Pistols", not "Automatics"
      expect(within(dialog).queryByText(SkillKey.automatics)).toBeNull()
      expect(within(dialog).getByText(SkillKey.pistols)).toBeTruthy()
    })
  })
})
