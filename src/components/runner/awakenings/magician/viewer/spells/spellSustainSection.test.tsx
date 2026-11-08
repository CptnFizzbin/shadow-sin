import { fireEvent, render, screen, waitFor } from "@testing-library/react"
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

import { SpellSustainSection } from "./spellSustainSection.tsx"

const increaseReflexes: SpellData = {
  kind: EntityKind.spell,
  id: "00000000-0000-0000-0000-000000000001",
  name: "Increase Reflexes",
  type: SpellType.Physical,
  range: SpellRange.Touch,
  damage: SpellDamage.Stun,
  category: SpellCategory.Health,
  drain: { type: SpellDrainType.Force, value: 1 },
  dealsDamage: false,
  duration: SpellDuration.Sustained,
  voluntaryTargetsOnly: false,
  effects: [{ type: GameEffectType.initiativeBonus, value: 1 }],
  sustained: false,
}

function renderWithSpell(spell: SpellData) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.spells = [spell]
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<SpellSustainSection spellId={spell.id} />, { wrapper: Wrapper })

  return store
}

describe("SpellSustainSection", () => {
  it("starts sustaining the spell on the selected target", async () => {
    // Arrange
    const store = renderWithSpell(increaseReflexes)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Other" }))
    fireEvent.click(screen.getByRole("button", { name: "Start Sustaining" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.spells[0]).toMatchObject({
      sustained: true,
      sustainedOn: SpellSustainTarget.Other,
    }))
  })

  it("switches a sustained spell's target, and stops sustaining it", async () => {
    // Arrange
    const store = renderWithSpell({ ...increaseReflexes, sustained: true, sustainedOn: SpellSustainTarget.Other })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Self" }))
    fireEvent.click(screen.getByRole("button", { name: "Stop Sustaining" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.spells[0]).toMatchObject({
      sustained: false,
      sustainedOn: SpellSustainTarget.Self,
    }))
  })

  it("hides the target toggle for a spell without effects", () => {
    // Arrange / Act
    renderWithSpell({ ...increaseReflexes, effects: [] })

    // Assert
    expect(screen.queryByRole("button", { name: "Self" })).toBeNull()
    expect(screen.getByRole("button", { name: "Start Sustaining" })).toBeDefined()
  })
})
