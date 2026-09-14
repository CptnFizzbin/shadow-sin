import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementCost } from "./cardElementCost.tsx"

describe("CardElementCost", () => {
  it("renders the raw value when no effective value is given", () => {
    // Arrange / Act
    render(<CardElementCost value={1200} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("1,200¥")).toBeDefined()
  })

  it("renders nothing when value is undefined", () => {
    // Arrange / Act
    const { container } = render(<CardElementCost value={undefined} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders only the effective value when it equals the raw value", () => {
    // Arrange / Act
    render(<CardElementCost value={1200} effectiveValue={1200} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getAllByText("1,200¥")).toHaveLength(1)
  })

  it("renders both the raw and effective values when they differ", () => {
    // Arrange / Act
    render(<CardElementCost value={1200} effectiveValue={2400} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("1,200¥")).toBeDefined()
    expect(screen.getByText("2,400¥")).toBeDefined()
  })
})
