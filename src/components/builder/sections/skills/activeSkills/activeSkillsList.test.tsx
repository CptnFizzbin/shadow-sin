import { act, fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ActiveSkillsList } from "./activeSkillsList.tsx"

describe("ActiveSkillsList", () => {
  it("opening a second skill to edit after saving the first shows the second skill's data, not the first skill's", async () => {
    // Arrange
    renderInBuilder(<ActiveSkillsList />, {
      updateRootState: (rootState) => {
        rootState.runner = {
          ...rootState.runner,
          skills: {
            ...rootState.runner.skills,
            activeSkills: [
              { name: SkillKey.pistols, rating: 3 },
              { name: SkillKey.automatics, rating: 4 },
            ],
          },
        }
      },
    })

    // Act — open Automatics, save it, then immediately open Pistols before the close
    // transition has a chance to clear the dialog state (simulates rapid user interaction)
    fireEvent.click(screen.getByText(SkillKey.automatics))

    let firstDialog: HTMLElement
    await waitFor(() => {
      firstDialog = screen.getByRole("dialog")
      expect(firstDialog).toBeTruthy()
    })

    // Save Automatics: triggers close but the transition hasn't ended yet
    act(() => {
      fireEvent.click(within(firstDialog!).getByRole("button", { name: /save/i }))
    })

    // Immediately open Pistols before the dialog transition completes
    fireEvent.click(screen.getByText(SkillKey.pistols))

    // Assert — the newly opened dialog must show Pistols, not the previously-saved Automatics
    await waitFor(() => {
      const dialogs = screen.getAllByRole("dialog")
      const dialog = dialogs[dialogs.length - 1]
      // The skill Select in the dialog should display "Pistols", not "Automatics"
      expect(within(dialog).queryByDisplayValue(SkillKey.automatics)).toBeNull()
      expect(within(dialog).getByDisplayValue(SkillKey.pistols)).toBeTruthy()
    })
  })
})
