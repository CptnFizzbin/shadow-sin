import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#/components/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#/state/runnerState.ts"
import { EntityKind } from "#/system/model/entities/entityKind.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import type { SpellData } from "#/system/model/magic/spellData.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellSustainTarget,
  SpellType,
} from "#/system/model/magic/spellData.ts"
import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"

import { SpellsViewerSection } from "./spellsViewerSection.tsx"

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
  effects: [{ type: GameEffectType.dicePoolMod, value: -2 }],
  sustained: false,
}

const increaseReflexes: SpellData = {
  ...manabolt,
  id: "00000000-0000-0000-0000-000000000002",
  name: "Increase Reflexes",
  category: SpellCategory.Health,
  dealsDamage: false,
  duration: SpellDuration.Sustained,
  effects: [{ type: GameEffectType.initiativeBonus, value: 1 }],
}

function renderWithSpells(spells: SpellData[]) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.spells = spells
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<SpellsViewerSection />, { wrapper: Wrapper })

  return store
}

describe("SpellsViewerSection", () => {
  it("shows a placeholder when no spells are learned", () => {
    // Arrange / Act
    renderWithSpells([])

    // Assert
    expect(screen.getByText("No spells learned")).toBeDefined()
  })

  it("shows spells from the store, grouped by category", () => {
    // Arrange / Act
    renderWithSpells([manabolt])

    // Assert
    expect(screen.getByText("Manabolt")).toBeDefined()
    expect(screen.getByText(SpellCategory.Combat)).toBeDefined()
  })

  it("stops sustaining a sustained spell straight away", async () => {
    // Arrange
    const store = renderWithSpells([{ ...increaseReflexes, sustained: true }])

    // Act
    fireEvent.click(screen.getByLabelText("Stop Sustaining"))

    // Assert
    await waitFor(() => expect(store.getState().runner.spells[0].sustained).toBe(false))
  })

  it("sustains a spell without effects without asking who it's on", async () => {
    // Arrange
    const store = renderWithSpells([{ ...increaseReflexes, effects: [] }])

    // Act
    fireEvent.click(screen.getByLabelText("Sustain"))

    // Assert
    await waitFor(() => expect(store.getState().runner.spells[0].sustained).toBe(true))
    expect(screen.queryByRole("dialog")).toBeNull()
  })

  it("asks who a spell with effects is sustained on, then sustains it on the chosen target", async () => {
    // Arrange
    const store = renderWithSpells([increaseReflexes])

    // Act
    fireEvent.click(screen.getByLabelText("Sustain"))
    const dialog = await screen.findByRole("dialog")
    fireEvent.click(within(dialog).getByRole("button", { name: "Other" }))
    fireEvent.click(within(dialog).getByRole("button", { name: "Sustain" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.spells[0]).toMatchObject({
      sustained: true,
      sustainedOn: SpellSustainTarget.Other,
    }))
  })

  it("leaves a spell with effects unsustained when the sustain dialog is cancelled", async () => {
    // Arrange
    const store = renderWithSpells([increaseReflexes])

    // Act
    fireEvent.click(screen.getByLabelText("Sustain"))
    const dialog = await screen.findByRole("dialog")
    fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }))

    // Assert
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    expect(store.getState().runner.spells[0].sustained).toBe(false)
  })
})
