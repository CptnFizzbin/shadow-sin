import { fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { SkillKey } from "#data/skills/skillKey.ts"
import { RunnerStoreProvider } from "#state/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#state/runnerState.ts"
import { loadMouse } from "#testUtils/fixtures/characters/mouse.ts"

import { ActiveSkillsListItem } from "./activeSkillsListItem.tsx"

function renderPistols() {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.attributes.agility = 3
    data.attributes.logic = 6
    data.skills.activeSkills = [{ name: SkillKey.pistols, rating: 4 }]
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ActiveSkillsListItem skillKey={SkillKey.pistols} rating={4} />, { wrapper: Wrapper })
}

function renderMouseSpellcasting() {
  const store = createRunnerStateStore({ mode: "viewer", runner: loadMouse() })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<ActiveSkillsListItem skillKey={SkillKey.spellcasting} rating={6} />, { wrapper: Wrapper })
}

describe("ActiveSkillsListItem", () => {
  it("shows Mouse's Combat Spells pool once, with both the Specialization and the Combat Spellcasting Focus", () => {
    // Arrange
    renderMouseSpellcasting()

    // Act
    fireEvent.click(screen.getByText(SkillKey.spellcasting))
    const dialog = within(screen.getByRole("dialog"))

    // Assert
    const poolTitles = dialog.getAllByTitle(/^Spellcasting/)
    expect(poolTitles.map((title) => title.textContent)).toEqual(["Spellcasting", "Spellcasting (Combat Spells)"])

    const combatPool = within(poolTitles[1].closest("[aria-expanded]") as HTMLElement)
    expect(combatPool.getByText("Specialization: Combat Spells")).toBeDefined()
    expect(combatPool.getByText("Spellcasting Focus")).toBeDefined()
    // MAG 6 + Spellcasting 6 + Specialization 2 + Focus 4, less 1 for Mouse's wounds.
    expect(combatPool.getAllByText("17").length).toBeGreaterThan(0)
  })

  it("opens a dialog whose dice pool reacts to changing the attribute selection", () => {
    // Arrange
    renderPistols()
    fireEvent.click(screen.getByText(SkillKey.pistols))
    const dialog = within(screen.getByRole("dialog"))

    // Assert: defaults to the skill's attribute (agility 3 + pistols 4). DicePool renders
    // its total twice — the always-visible header and the (hidden but mounted) expanded
    // ledger — same as in resistanceDicePools.test.tsx.
    expect(dialog.getAllByText("7")).toHaveLength(2)

    // Act: switch to a different attribute (logic 6 + pistols 4)
    fireEvent.mouseDown(dialog.getByRole("combobox"))
    fireEvent.click(screen.getByRole("option", { name: "LOG — logic" }))

    // Assert: the pool shown in the dialog updates to reflect the new attribute
    expect(dialog.getAllByText("10")).toHaveLength(2)
    expect(dialog.queryByText("7")).toBeNull()
  })
})
