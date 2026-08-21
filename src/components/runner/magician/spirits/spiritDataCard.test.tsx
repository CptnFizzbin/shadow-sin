import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityKind } from "#/system/entityKind.ts"
import type { SpiritData } from "#/system/magic/spiritData.ts"
import { SpiritType } from "#/system/magic/spiritData.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { SpiritDataCard } from "./spiritDataCard.tsx"

const namedFireSpirit: SpiritData = {
  kind: EntityKind.spirit,
  id: "00000000-0000-0000-0000-000000000001",
  name: "Ember",
  spiritType: SpiritType.fire,
  force: 4,
  services: { max: 4, used: 1 },
  bound: true,
  optionalPowers: ["Fear"],
  notes: "Summoned during the Halloween run.",
  damage: { physical: 0, stun: 0 },
}

const unnamedSpirit: SpiritData = {
  kind: EntityKind.spirit,
  id: "00000000-0000-0000-0000-000000000002",
  name: "",
  spiritType: SpiritType.earth,
  force: 3,
  services: { max: 2, used: 0 },
  bound: false,
  optionalPowers: [],
  damage: { physical: 0, stun: 0 },
}

const noop = () => {}

describe("SpiritDataCard", () => {
  it("uses the spirit's name as its title, with its type as a SubType row", () => {
    // Arrange / Act
    render(
      <SpiritDataCard spirit={namedFireSpirit} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Ember")).toBeDefined()
    expect(screen.getByText("Spirit of Fire")).toBeDefined()
  })

  it("falls back to the spirit type's label as its title when it has no name", () => {
    // Arrange / Act
    render(
      <SpiritDataCard spirit={unnamedSpirit} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert: only one occurrence — the title — since there's no separate SubType row.
    expect(screen.getAllByText("Spirit of Earth")).toHaveLength(1)
  })

  it("renders Force, Services, Initiative, and base powers", () => {
    // Arrange / Act
    render(
      <SpiritDataCard spirit={namedFireSpirit} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Force: 4")).toBeDefined()
    expect(screen.getByText("Services: 1/4")).toBeDefined()
    expect(screen.getByText("Astral Form")).toBeDefined()
  })

  it("renders optional powers under their own label", () => {
    // Arrange / Act
    render(
      <SpiritDataCard spirit={namedFireSpirit} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert: "Fear" has a computed pool (Force + Willpower = 4 + 4), so its chip shows both.
    expect(screen.getByText("Optional Powers")).toBeDefined()
    expect(screen.getByText("Fear [8]")).toBeDefined()
  })

  it("omits the Optional Powers row when there are none", () => {
    // Arrange / Act
    render(
      <SpiritDataCard spirit={unnamedSpirit} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.queryByText("Optional Powers")).toBeNull()
  })

  it("renders notes when present", () => {
    // Arrange / Act
    render(
      <SpiritDataCard spirit={namedFireSpirit} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Summoned during the Halloween run.")).toBeDefined()
  })

  it("sizes the Physical and Stun condition monitors off Force-derived attributes", () => {
    // Arrange / Act: Force 4 Fire spirit — body = 4 + 1 = 5, willpower = 4 + 0 = 4, so
    // Physical max = 8 + Ceil(5/2) = 11 and Stun max = 8 + Ceil(4/2) = 10.
    render(
      <SpiritDataCard spirit={namedFireSpirit} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Physical 0/11")).toBeDefined()
    expect(screen.getByText("Stun 0/10")).toBeDefined()
  })

  it("dispatches onDamageChange with only the Stun track updated when a Stun box is toggled", () => {
    // Arrange: Stun max is 10 — box 3 is the first wound-marker cell (labeled "-1") on both
    // tracks; Physical renders first, so the second match is Stun's.
    const onDamageChange = vi.fn()
    render(
      <SpiritDataCard
        spirit={{ ...namedFireSpirit, damage: { physical: 0, stun: 0 } }}
        onEdit={noop}
        onRemove={noop}
        onDamageChange={onDamageChange}
      />,
      { wrapper: ThemeWrapper },
    )

    // Act
    const [, stunWoundCell] = screen.getAllByRole("button", { name: "-1" })
    fireEvent.click(stunWoundCell)

    // Assert
    expect(onDamageChange).toHaveBeenCalledWith({ physical: 0, stun: 3 })
  })

  it("offers Edit and Remove actions", () => {
    // Arrange
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    render(
      <SpiritDataCard spirit={namedFireSpirit} onEdit={onEdit} onRemove={onRemove} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    // Assert
    expect(onEdit).toHaveBeenCalledOnce()
  })
})
