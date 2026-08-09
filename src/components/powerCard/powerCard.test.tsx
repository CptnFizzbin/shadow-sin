import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { EntityCard } from "#/components/entityCard/entityCard.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"
import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { PowerCard } from "./powerCard.tsx"

const improvedReflexes: AdeptPowerData = {
  type: "adeptPower",
  id: "00000000-0000-0000-0000-000000000001",
  name: "Improved Reflexes",
  rating: 2,
  costPerRating: 1.5,
}

describe("PowerCard", () => {
  it("renders the power's name and rating via EntityCard", () => {
    // Arrange / Act
    render(<PowerCard power={improvedReflexes} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Improved Reflexes")).toBeDefined()
    expect(screen.getByText("Rating: 2")).toBeDefined()
  })

  it("renders the power's cost per rating and total Power Point cost", () => {
    // Arrange / Act
    render(<PowerCard power={improvedReflexes} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Cost/Rating: 1.5")).toBeDefined()
    expect(screen.getByText("3 PP")).toBeDefined()
  })

  it("invokes onOpen when tapped", () => {
    // Arrange
    const onOpen = vi.fn()
    render(<PowerCard power={improvedReflexes} onOpen={onOpen} />, { wrapper: ThemeWrapper })

    // Act
    fireEvent.click(screen.getByRole("button"))

    // Assert
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("offers an Edit action that calls onEdit", () => {
    // Arrange
    const onEdit = vi.fn()
    render(<PowerCard power={improvedReflexes} onEdit={onEdit} />, { wrapper: ThemeWrapper })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Actions menu" }))
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }))

    // Assert
    expect(onEdit).toHaveBeenCalledOnce()
  })

  it("exposes EntityCard's content elements it pulls in, by name", () => {
    // Arrange / Act / Assert
    expect(PowerCard.Title).toBe(EntityCard.Title)
    expect(PowerCard.Rating).toBe(EntityCard.Rating)
    expect(PowerCard.Source).toBe(EntityCard.Source)
    expect(PowerCard.Effects).toBe(EntityCard.Effects)
    expect(PowerCard.Stat).toBe(EntityCard.Stat)
    expect(PowerCard.Action).toBe(EntityCard.Action)
  })

  it("re-exposes EntityCard's Layout regions unchanged", () => {
    // Arrange / Act / Assert
    expect(PowerCard.Layout).toBe(EntityCard.Layout)
  })
})
