import { act, fireEvent, screen, waitFor, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"
import { renderInBuilder } from "#testUtils/renderUtils.tsx"

import { ActiveSkillsList } from "./activeSkillsList.tsx"

describe("ActiveSkillsList", () => {
  it("opening a second skill to edit after saving the first shows the second skill's data, not the first skill's", async () => {
    // Arrange
    renderInBuilder(<ActiveSkillsList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory((runner) => ({
        ...runner,
        skills: {
          ...runner.skills,
          activeSkills: [
            { name: SkillKey.pistols, rating: 3 },
            { name: SkillKey.automatics, rating: 4 },
          ],
        },
      }))),
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

  it("removing an active skill dispatches removeActiveSkill and updates the store", async () => {
    // Arrange
    renderInBuilder(<ActiveSkillsList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory((runner) => ({
        ...runner,
        skills: {
          ...runner.skills,
          activeSkills: [{ name: SkillKey.pistols, rating: 3 }],
        },
      }))),
    })
    expect(screen.getByText(SkillKey.pistols)).toBeTruthy()

    // Act: the remove icon button has no accessible name.
    const removeButton = screen.getAllByRole("button").find((button) => button.textContent === "")
    fireEvent.click(removeButton!)

    // Assert: the UI re-rendered off the updated store — the skill and its
    // "Active Skills" section header are both gone, replaced by the empty state.
    await waitFor(() => expect(screen.queryByText(SkillKey.pistols)).toBeNull())
    expect(screen.getByText("No active skills added")).toBeTruthy()
  })

  it("editing and saving an active skill's specialization dispatches setActiveSkill and updates the store", async () => {
    // Arrange
    renderInBuilder(<ActiveSkillsList />, {
      runnerStore: new RunnerDataStore(runnerDataFactory((runner) => ({
        ...runner,
        skills: {
          ...runner.skills,
          activeSkills: [{ name: SkillKey.pistols, rating: 3 }],
        },
      }))),
    })

    // Act: the Skill and Specialization Selects don't wire an accessible name
    // (no `labelId`), so they're only distinguishable by document order —
    // Skill first, Specialization second.
    fireEvent.click(screen.getByText(SkillKey.pistols))
    const dialog = await screen.findByRole("dialog")
    const [, specializationCombobox] = within(dialog).getAllByRole("combobox")
    fireEvent.mouseDown(specializationCombobox)
    fireEvent.click(await screen.findByRole("option", { name: "Revolvers" }))
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: the UI re-rendered off the updated store.
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(screen.getByText("Revolvers")).toBeTruthy()
  })
})
