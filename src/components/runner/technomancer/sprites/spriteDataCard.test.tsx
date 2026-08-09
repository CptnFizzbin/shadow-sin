import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import type { SpriteData } from "#/system/magic/spriteData.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { SpriteDataCard } from "./spriteDataCard.tsx"

const courierSprite: SpriteData = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "Courier",
  force: 4,
  services: { max: 3, used: 1 },
  bound: true,
  notes: "Compiled to fetch a datastore.",
  damage: { matrix: 0 },
}

const noop = () => {}

describe("SpriteDataCard", () => {
  it("renders the sprite's name, Force, and Services", () => {
    // Arrange / Act
    render(<SpriteDataCard sprite={courierSprite} onEdit={noop} onRemove={noop} onDamageChange={noop} />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    expect(screen.getByText("Courier")).toBeDefined()
    expect(screen.getByText("Force: 4")).toBeDefined()
    expect(screen.getByText("Services: 1/3")).toBeDefined()
  })

  it("renders a Registered stat only when bound", () => {
    // Arrange / Act
    render(
      <SpriteDataCard sprite={{ ...courierSprite, bound: false }} onEdit={noop} onRemove={noop} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.queryByText("Registered")).toBeNull()
  })

  it("renders notes when present", () => {
    // Arrange / Act
    render(<SpriteDataCard sprite={courierSprite} onEdit={noop} onRemove={noop} onDamageChange={noop} />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    expect(screen.getByText("Compiled to fetch a datastore.")).toBeDefined()
  })

  it("sizes the Matrix condition monitor off Force, using 8 + Ceil(Force / 2)", () => {
    // Arrange / Act
    render(<SpriteDataCard sprite={courierSprite} onEdit={noop} onRemove={noop} onDamageChange={noop} />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    expect(screen.getByText("Matrix 0/10")).toBeDefined()
  })

  it("toggling a Matrix damage box calls onDamageChange", () => {
    // Arrange
    const onDamageChange = vi.fn()
    render(
      <SpriteDataCard sprite={courierSprite} onEdit={noop} onRemove={noop} onDamageChange={onDamageChange} />,
      { wrapper: ThemeWrapper },
    )

    // Act: box 3 is the first wound-marker cell (labeled "-1").
    fireEvent.click(screen.getByRole("button", { name: "-1" }))

    // Assert
    expect(onDamageChange).toHaveBeenCalledWith({ matrix: 3 })
  })

  it("offers Edit and Remove actions", () => {
    // Arrange
    const onEdit = vi.fn()
    const onRemove = vi.fn()
    render(
      <SpriteDataCard sprite={courierSprite} onEdit={onEdit} onRemove={onRemove} onDamageChange={noop} />,
      { wrapper: ThemeWrapper },
    )

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Remove" }))

    // Assert
    expect(onRemove).toHaveBeenCalledOnce()
  })
})
