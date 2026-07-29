import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCardStat } from "./itemCardStat.tsx"

describe("ItemCardStat", () => {
  it("renders label and value together", () => {
    render(<ItemCardStat label="DV" value="4P" type="damage" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("DV: 4P")).toBeDefined()
  })

  it("renders value only when no label is given", () => {
    render(<ItemCardStat value="Rating 4" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Rating 4")).toBeDefined()
  })

  it("renders restrictions as value-only chips even when a label is supplied", () => {
    render(<ItemCardStat label="Availability" value="8R" type="restriction" />, {
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
    render(<ItemCardStat label="X" value="1" type={type} />, { wrapper: ThemeWrapper })

    const chip = screen.getByText("X: 1").closest(".MuiChip-root")
    expect(chip?.classList.contains(expectedClass)).toBe(true)
  })

  it("has no color class for untyped stats", () => {
    render(<ItemCardStat label="X" value="1" />, { wrapper: ThemeWrapper })

    const chip = screen.getByText("X: 1").closest(".MuiChip-root")
    expect(chip?.className).not.toMatch(/MuiChip-color(?!Default)/)
  })
})
