import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityCard } from "#/components/ui/cards/entityCard/entityCard.tsx"
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
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { SpellCard } from "./spellCard.tsx"

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
  description: "A mana-based attack spell.",
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

describe("SpellCard", () => {
  it("renders the spell's name, description, and Type/Range/Duration/Damage/Drain stats", () => {
    // Arrange / Act
    render(<SpellCard spell={manabolt} onOpen={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Manabolt")).toBeDefined()
    expect(screen.getByText("A mana-based attack spell.")).toBeDefined()
    expect(screen.getByText("Type: Mana")).toBeDefined()
    expect(screen.getByText("Range: LoS")).toBeDefined()
    expect(screen.getByText("Duration: Instantaneous")).toBeDefined()
    expect(screen.getByText("Damage: Physical")).toBeDefined()
    expect(screen.getByText("Drain: F/2")).toBeDefined()
  })

  it("omits the Damage stat when the spell doesn't deal damage", () => {
    // Arrange
    const detection: SpellData = { ...manabolt, dealsDamage: false }

    // Act
    render(<SpellCard spell={detection} onOpen={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.queryByText(/^Damage:/)).toBeNull()
  })

  it("navigates via onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    render(<SpellCard spell={manabolt} onOpen={onOpen} />, { wrapper: ThemeWrapper })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("shows no Sustain button for a spell that can't be sustained", () => {
    // Arrange / Act
    render(<SpellCard spell={manabolt} onOpen={vi.fn()} onToggleSustained={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.queryByLabelText("Sustain")).toBeNull()
    expect(screen.queryByLabelText("Stop Sustaining")).toBeNull()
  })

  it("shows a Sustain button for a sustainable spell that isn't sustained", () => {
    // Arrange
    const sustainable: SpellData = { ...increaseReflexes, sustained: false }

    // Act
    render(<SpellCard spell={sustainable} onOpen={vi.fn()} onToggleSustained={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByLabelText("Sustain")).toBeDefined()
    expect(screen.queryByLabelText("Sustained")).toBeNull()
  })

  it("shows a Stop Sustaining button, the Sustained status, and its target once the spell is sustained", () => {
    // Arrange
    const sustained: SpellData = { ...increaseReflexes, sustained: true, sustainedOn: SpellSustainTarget.Other }

    // Act
    render(<SpellCard spell={sustained} onOpen={vi.fn()} onToggleSustained={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByLabelText("Stop Sustaining")).toBeDefined()
    expect(screen.getByLabelText("Sustained")).toBeDefined()
    expect(screen.getByText("Sustained on: Other")).toBeDefined()
  })

  it("omits the sustain target for a sustained spell without effects", () => {
    // Arrange
    const sustained: SpellData = { ...increaseReflexes, effects: [], sustained: true }

    // Act
    render(<SpellCard spell={sustained} onOpen={vi.fn()} onToggleSustained={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByLabelText("Sustained")).toBeDefined()
    expect(screen.queryByText(/^Sustained on:/)).toBeNull()
  })

  it("pressing the Sustain button calls onToggleSustained without also opening the card", () => {
    // Arrange
    const onToggleSustained = vi.fn()
    const onOpen = vi.fn()
    render(
      <SpellCard spell={increaseReflexes} onOpen={onOpen} onToggleSustained={onToggleSustained} />,
      { wrapper: ThemeWrapper },
    )

    // Act
    fireEvent.click(screen.getByLabelText("Sustain"))

    // Assert
    expect(onToggleSustained).toHaveBeenCalledOnce()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it("exposes EntityCard's content elements it pulls in, by name", () => {
    // Arrange / Act / Assert
    expect(SpellCard.Title).toBe(EntityCard.Title)
    expect(SpellCard.Rating).toBe(EntityCard.Rating)
    expect(SpellCard.Source).toBe(EntityCard.Source)
    expect(SpellCard.Effects).toBe(EntityCard.Effects)
    expect(SpellCard.Stat).toBe(EntityCard.Stat)
    expect(SpellCard.Action).toBe(EntityCard.Action)
  })

  it("re-exposes EntityCard's Layout regions unchanged", () => {
    // Arrange / Act / Assert
    expect(SpellCard.Layout).toBe(EntityCard.Layout)
  })
})
