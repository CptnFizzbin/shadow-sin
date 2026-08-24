import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { EntityKind } from "#/system/entityKind.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
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

function renderWithSpells(spells: SpellData[]) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.spells = spells
  } })
  const store = new RunnerDataStore(runnerData)

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

  it("toggling sustained dispatches toggleSpellSustained and updates the store", async () => {
    // Arrange
    const store = renderWithSpells([manabolt])

    // Act
    fireEvent.click(screen.getByLabelText("Not Sustained"))

    // Assert: state updated...
    await waitFor(() => expect(store.getState().spells[0].sustained).toBe(true))
  })
})
