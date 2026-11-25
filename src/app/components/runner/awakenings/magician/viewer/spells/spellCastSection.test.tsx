import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it, vi } from "vitest"

import type { UUID } from "#common/uuid/uuidUtils.ts"
import { AttributeKey } from "#data/attributes/attributeKey.ts"
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
  SpellType,
} from "#data/magic/spellData.ts"
import { runnerDataFactory } from "#data/runner/runnerData.factory.ts"
import { RunnerStoreProvider } from "#state/runner/runnerStoreProvider.tsx"
import { createRunnerStateStore } from "#state/runnerState.ts"

import { SpellCastSection } from "./spellCastSection.tsx"

const manaball: SpellData = {
  kind: EntityKind.spell,
  id: "00000000-0000-0000-0000-000000000001",
  name: "Manaball",
  type: SpellType.Mana,
  range: SpellRange.LoS,
  damage: SpellDamage.Stun,
  category: SpellCategory.Combat,
  drain: { type: SpellDrainType.Force, value: 0 },
  dealsDamage: false,
  duration: SpellDuration.Instantaneous,
  voluntaryTargetsOnly: false,
  effects: [{ type: GameEffectType.dicePoolMod, value: -2 }],
  sustained: false,
}

const sustainingFocus: FocusData = {
  kind: EntityKind.item,
  id: "00000000-0000-0000-0000-0000000000f1" as UUID,
  name: "Combat Sustaining Focus",
  itemType: ItemType.magical,
  magicalType: MagicalType.focus,
  focusType: FocusType.Sustaining,
  force: 2,
  spellCategory: SpellCategory.Combat,
  bonded: true,
  state: ItemState.available,
  items: { parentId: null, childIds: [] },
}

function renderWithMagic(magic: number, focusProps: Partial<Parameters<typeof SpellCastSection>[0]> = {}) {
  const runnerData = runnerDataFactory({ afterBuild: (data) => {
    data.attributes[AttributeKey.magic] = magic
  } })
  const store = createRunnerStateStore({ mode: "viewer", runner: runnerData })

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  const onClose = vi.fn()
  render(<SpellCastSection spell={manaball} onClose={onClose} {...focusProps} />, { wrapper: Wrapper })

  return { store, onClose }
}

describe("SpellCastSection", () => {
  it("defaults the apply-drain button to the full drain value with zero resistance hits", () => {
    // Arrange / Act
    renderWithMagic(6)

    // Assert — Force defaults to Magic (6), so DV = floor(6/2) + 0 = 3
    expect(screen.getByRole("button", { name: "Apply 3 drain" })).toBeDefined()
  })

  it("reduces the apply-drain amount by the entered resistance hits", () => {
    // Arrange
    renderWithMagic(6)

    // Act
    fireEvent.change(screen.getByLabelText("Resistance Hits"), { target: { value: "2" } })

    // Assert
    expect(screen.getByRole("button", { name: "Apply 1 drain" })).toBeDefined()
  })

  it("never drops the apply-drain amount below zero and disables the button", () => {
    // Arrange
    renderWithMagic(6)

    // Act
    fireEvent.change(screen.getByLabelText("Resistance Hits"), { target: { value: "9" } })

    // Assert
    const button = screen.getByRole("button", { name: "Apply 0 drain" })
    expect(button.hasAttribute("disabled")).toBe(true)
  })

  it("applying drain adds it to the stun track and closes the dialog", async () => {
    // Arrange
    const { store, onClose } = renderWithMagic(6)
    fireEvent.change(screen.getByLabelText("Resistance Hits"), { target: { value: "2" } })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Apply 1 drain" }))

    // Assert
    await waitFor(() => expect(store.getState().runner.damage.stun).toBe(1))
    expect(onClose).toHaveBeenCalled()
  })

  it("caps Force at the Force of the chosen Sustaining Focus", () => {
    // Arrange / Act
    renderWithMagic(6, { sustainingFoci: [sustainingFocus], sustainingFocus, onSustainingFocusChange: vi.fn() })

    // Assert — Force 6 is capped to the focus's 2, so DV = floor(2/2) + 0 = 1
    expect(screen.getByRole("button", { name: "Apply 1 drain" })).toBeDefined()
    expect(screen.getByText(/capped by Combat Sustaining Focus \(Force 2\)/)).toBeDefined()
  })

  it("hides the focus picker when no Sustaining Focus is free", () => {
    // Arrange / Act
    renderWithMagic(6, { onSustainingFocusChange: vi.fn() })

    // Assert
    expect(screen.queryByLabelText("Sustaining Focus")).toBeNull()
  })
})
