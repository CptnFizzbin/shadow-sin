import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it } from "vitest"

import { RunnerStoreProvider } from "#app/components/runner/runnerStoreProvider.tsx"
import type { UUID } from "#common/uuid/uuidUtils.ts"
import { EntityKind } from "#data/entities/entityKind.ts"
import { GameEffectType } from "#data/gameEffects/gameEffectType.ts"
import { ItemState } from "#data/items/itemState.ts"
import { ItemType } from "#data/items/itemType.ts"
import type { FocusData } from "#data/items/magicalData.ts"
import { MagicalType } from "#data/items/magicalData.ts"
import { FocusType } from "#data/magic/focusData.ts"
import type { SpellData } from "#data/magic/spellData.ts"
import {
  SpellCategory,
  SpellDamage,
  SpellDrainType,
  SpellDuration,
  SpellRange,
  SpellSustainTarget,
  SpellType,
} from "#data/magic/spellData.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { createRunnerStateStore } from "#state/runnerState.ts"

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

const sustainingFocus: FocusData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-0000000000f1" as UUID,
  name: "Health Sustaining Focus",
  itemType: ItemType.magical,
  magicalType: MagicalType.focus,
  focusType: FocusType.Sustaining,
  force: 3,
  spellCategory: SpellCategory.Health,
  bonded: true,
  state: ItemState.available,
  items: { parentId: null, childIds: [] },
}

function renderWithSpell(spell: SpellData, sustainingFocusId?: string | null) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.spells = [spell]
    data._data_.items[sustainingFocus.id] = sustainingFocus
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  render(<SpellSustainSection spellId={spell.id} sustainingFocusId={sustainingFocusId} />, { wrapper: Wrapper })

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

  it("starts sustaining the spell with the chosen focus holding it", async () => {
    // Arrange
    const store = renderWithSpell(increaseReflexes, sustainingFocus.id)

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Start Sustaining" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.spells[0]).toMatchObject({
      sustained: true,
      sustainedBy: sustainingFocus.id,
    }))
    expect(screen.getByText("Held by Health Sustaining Focus — no sustaining penalty")).toBeDefined()
  })

  it("releases the focus when the spell stops being sustained", async () => {
    // Arrange
    const store = renderWithSpell({ ...increaseReflexes, sustained: true, sustainedBy: sustainingFocus.id })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Stop Sustaining" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.spells[0]).toMatchObject({
      sustained: false,
      sustainedBy: null,
    }))
  })
})
