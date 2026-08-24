import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import type { FC, PropsWithChildren } from "react"
import { describe, expect, it, vi } from "vitest"

import { RunnerDataStore } from "#/components/runner/sheet/runnerDataStore.ts"
import { RunnerStoreProvider } from "#/components/runner/sheet/runnerStoreProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"
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

function renderWithMagic(magic: number) {
  const runnerData = runnerDataFactory({ override: (data) => {
    data.attributes[AttributeKey.magic] = magic
    return data
  } })
  const store = new RunnerDataStore(runnerData)

  const Wrapper: FC<PropsWithChildren> = ({ children }) => (
    <RunnerStoreProvider store={store}>{children}</RunnerStoreProvider>
  )

  const onClose = vi.fn()
  render(<SpellCastSection spell={manaball} onClose={onClose} />, { wrapper: Wrapper })

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
    await waitFor(() => expect(store.getState().damage.stun).toBe(1))
    expect(onClose).toHaveBeenCalled()
  })
})
