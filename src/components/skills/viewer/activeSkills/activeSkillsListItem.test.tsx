import { fireEvent, render, screen, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

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

describe("ActiveSkillsListItem", () => {
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
