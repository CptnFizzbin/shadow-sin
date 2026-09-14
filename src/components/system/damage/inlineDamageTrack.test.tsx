import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { InlineDamageTrack } from "./inlineDamageTrack.tsx"

describe("InlineDamageTrack", () => {
  it("renders one box per max, filled up through current", () => {
    // Arrange / Act
    render(<InlineDamageTrack max={6} current={3} onChange={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    const buttons = screen.getAllByRole("button")
    expect(buttons).toHaveLength(6)
    expect(buttons[0].className).toMatch(/MuiButton-contained/) // value 1
    expect(buttons[2].className).toMatch(/MuiButton-contained/) // value 3
    expect(buttons[3].className).toMatch(/MuiButton-outlined/) // value 4

    // Assert: cells are fixed-size flex items in a wrapping row, so cell size (and tap
    // target) stays uniform regardless of the container's width or how many boxes there are
    const row = buttons[0].parentElement as HTMLElement
    const rowStyle = getComputedStyle(row)
    expect(rowStyle.display).toBe("flex")
    expect(rowStyle.flexWrap).toBe("wrap")
    const cellStyle = getComputedStyle(buttons[0])
    expect(cellStyle.width).toBe("32px")
    expect(cellStyle.height).toBe("32px")
  })

  it("wraps onto additional rows past 10 boxes", () => {
    // Arrange / Act
    render(<InlineDamageTrack max={14} current={0} onChange={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert: flexWrap (not a fixed column count) is what lets a narrow container wrap this many
    // fixed-size cells onto more rows
    const row = screen.getAllByRole("button")[0].parentElement as HTMLElement
    expect(getComputedStyle(row).flexWrap).toBe("wrap")
    expect(screen.getAllByRole("button")).toHaveLength(14)
  })

  it("shows the wound modifier every woundInterval boxes, blank otherwise", () => {
    // Arrange / Act
    render(<InlineDamageTrack max={9} current={0} onChange={vi.fn()} />, { wrapper: ThemeWrapper })

    // Assert
    const buttons = screen.getAllByRole("button")
    expect(buttons[0].textContent).toBe(" ")
    expect(buttons[1].textContent).toBe(" ")
    expect(buttons[2].textContent).toBe("-1")
    expect(buttons[5].textContent).toBe("-2")
    expect(buttons[8].textContent).toBe("-3")
  })

  it("honours a custom woundInterval", () => {
    // Arrange / Act
    render(<InlineDamageTrack max={4} current={0} onChange={vi.fn()} woundInterval={2} />, {
      wrapper: ThemeWrapper,
    })

    // Assert
    const buttons = screen.getAllByRole("button")
    expect(buttons[1].textContent).toBe("-1")
    expect(buttons[3].textContent).toBe("-2")
  })

  it("clicking a cell above current sets current to that cell's value", () => {
    // Arrange
    const onChange = vi.fn()
    render(<InlineDamageTrack max={6} current={2} onChange={onChange} />, { wrapper: ThemeWrapper })

    // Act: value 5 (index 4)
    fireEvent.click(screen.getAllByRole("button")[4])

    // Assert
    expect(onChange).toHaveBeenCalledWith(5)
  })

  it("clicking the cell matching current toggles it back by one", () => {
    // Arrange
    const onChange = vi.fn()
    render(<InlineDamageTrack max={6} current={3} onChange={onChange} />, { wrapper: ThemeWrapper })

    // Act: value 3 is a wound marker, so it has an accessible name
    fireEvent.click(screen.getByRole("button", { name: "-1" }))

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
