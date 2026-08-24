import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
import { AwakeningType } from "#/system/awakeningType.ts"
import { EntityKind } from "#/system/entityKind.ts"
import type { SpellData } from "#/system/magic/spellData.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellType,
} from "#/system/magic/spellData.ts"
import { runnerDataFactory } from "#/system/runnerData.factory.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

import { SpellsList } from "./spellsList.tsx"

const manabolt: SpellData = {
  kind: EntityKind.spell,
  id: "00000000-0000-0000-0000-000000000001",
  name: "Manabolt",
  type: SpellType.Mana,
  range: SpellRange.LoS,
  damage: SpellDamage.Physical,
  category: SpellCategory.Combat,
  drain: { type: SpellDrainType.Force, value: 0 },
  dealsDamage: true,
  duration: SpellDuration.Instantaneous,
  voluntaryTargetsOnly: false,
}

function renderWithSpells(spells: SpellData[]) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.biology.awakening = AwakeningType.Magician
    data.attributes[AttributeKey.magic] = 6
    data.skills.activeSkills = [{ name: SkillKey.spellcasting, rating: 4 }]
    data.spells = spells
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<SpellsList />, { wrapper: Wrapper })

  return store
}

describe("SpellsList", () => {
  it("shows spells from the store", () => {
    // Arrange / Act
    renderWithSpells([manabolt])

    // Assert
    expect(screen.getByText("Manabolt")).toBeDefined()
  })

  it("adding a spell dispatches saveSpell and updates the store", async () => {
    // Arrange
    const store = renderWithSpells([])

    // Act
    fireEvent.click(screen.getByRole("button", { name: /add spell/i }))
    const dialog = await screen.findByRole("dialog", { name: "Add Spell" })
    fireEvent.change(within(dialog).getByLabelText(/^name/i), {
      target: { value: "Fireball" },
    })
    fireEvent.click(within(dialog).getByRole("button", { name: /save/i }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().spells).toHaveLength(1))
    expect(store.getState().spells[0].name).toBe("Fireball")
    // ...and the UI re-rendered off that same state.
    expect(await screen.findByText("Fireball")).toBeDefined()
  })

  it("deleting a spell from the edit dialog dispatches removeSpell and updates the store", async () => {
    // Arrange
    const store = renderWithSpells([manabolt])

    // Act
    fireEvent.click(screen.getByText("Manabolt"))
    const dialog = await screen.findByRole("dialog", { name: "Edit Spell" })
    fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().spells).toHaveLength(0))
    // ...and the UI re-rendered off that same state.
    expect(screen.queryByText("Manabolt")).toBeNull()
  })
})
