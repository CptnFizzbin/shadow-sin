import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { InlineDamageTrack } from "./inlineDamageTrack.tsx"

describe("InlineDamageTrack", () => {
  it("renders one box per max, filled up through current", () => {
    // Arrange / Act
    render(<InlineDamageTrack max={6} current={3} onChange={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getAllByRole("button")).toHaveLength(6)
    expect(screen.getByRole("button", { name: "1" }).className).toMatch(/MuiButton-contained/)
    expect(screen.getByRole("button", { name: "3" }).className).toMatch(/MuiButton-contained/)
    expect(screen.getByRole("button", { name: "4" }).className).toMatch(/MuiButton-outlined/)
  })

  it("wraps onto additional rows past 10 boxes", () => {
    // Arrange / Act
    render(<InlineDamageTrack max={14} current={0} onChange={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert: capped at 10 columns regardless of how many boxes there are
    const grid = screen.getAllByRole("button")[0].parentElement as HTMLElement
    expect(getComputedStyle(grid).gridTemplateColumns).toBe("repeat(10, 1fr)")
    expect(screen.getAllByRole("button")).toHaveLength(14)
  })

  it("clicking a cell above current sets current to that cell's value", () => {
    // Arrange
    const onChange = vi.fn()
    render(<InlineDamageTrack max={6} current={2} onChange={onChange} />, { wrapper: ThemeWrapper })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "5" }))

    // Assert
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it("clicking the cell matching current toggles it back by one", () => {
    // Arrange
    const onChange = vi.fn()
    render(<InlineDamageTrack max={6} current={3} onChange={onChange} />, { wrapper: ThemeWrapper })

    // Act
    fireEvent.click(screen.getByRole("button", { name: "3" }))

    // Assert
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it("shows the label with a current/max readout", () => {
    // Arrange / Act
    render(<InlineDamageTrack label="Physical" max={10} current={4} onChange={vi.fn()} />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    expect(screen.getByText("Physical 4/10")).toBeDefined()
  })
})
