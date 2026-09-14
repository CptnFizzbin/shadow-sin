import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementStat } from "./cardElementStat.tsx"

describe("CardElementStat", () => {
  it("renders nothing when value is undefined", () => {
    // Arrange / Act
    const { container } = render(<CardElementStat label="Res" value={undefined} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders label and value together", () => {
    render(<CardElementStat label="DV" value="4P" type="damage" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("DV: 4P")).toBeDefined()
  })

  it("renders value only when no label is given", () => {
    render(<CardElementStat value="Rating 4" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Rating 4")).toBeDefined()
  })

  it("renders restrictions as value-only chips even when a label is supplied", () => {
    render(<CardElementStat label="Availability" value="8R" type="restriction" />, {
      wrapper: ThemeWrapper,
    })

    expect(screen.getByText("8R")).toBeDefined()
    expect(screen.queryByText(/availability/i)).toBeNull()
  })

  it.each([
    ["damage", "MuiChip-colorSecondary"],
    ["modifier", "MuiChip-colorInfo"],
    ["rating", "MuiChip-colorPrimary"],
    ["warning", "MuiChip-colorWarning"],
    ["forbidden", "MuiChip-colorError"],
  ] as const)("applies %s styling for type=%s", (type, expectedClass) => {
    render(<CardElementStat label="X" value="1" type={type} />, { wrapper: ThemeWrapper })

    const chip = screen.getByText("X: 1").closest(".MuiChip-root")
    expect(chip?.classList.contains(expectedClass)).toBe(true)
  })

  it("has no color class for untyped stats", () => {
    render(<CardElementStat label="X" value="1" />, { wrapper: ThemeWrapper })

    const chip = screen.getByText("X: 1").closest(".MuiChip-root")
    expect(chip?.className).not.toMatch(/MuiChip-color(?!Default)/)
  })

  it("renders only the effective value when it equals the raw value", () => {
    // Arrange / Act
    render(<CardElementStat label="Ess" value="0.00" effectiveValue="0.00" type="modifier" />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    expect(screen.getAllByText("Ess: 0.00")).toHaveLength(1)
  })

  it("renders both the raw and effective values when they differ", () => {
    // Arrange / Act
    render(<CardElementStat label="Ess" value="1.00" effectiveValue="0.80" type="modifier" />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    expect(screen.getByText("Ess: 1.00")).toBeDefined()
    expect(screen.getByText("Ess: 0.80")).toBeDefined()
  })

  it("applies the effective value to restriction-style value-only rendering", () => {
    // Arrange / Act
    render(<CardElementStat value="6R" effectiveValue="8F" type="restriction" />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("6R")).toBeDefined()
    expect(screen.getByText("8F")).toBeDefined()
  })
})
