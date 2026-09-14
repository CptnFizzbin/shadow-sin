import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementNotes } from "./cardElementNotes.tsx"

describe("CardElementNotes", () => {
  it("renders nothing when value is undefined", () => {
    // Arrange / Act
    const { container } = render(<CardElementNotes value={undefined} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders nothing when value is empty", () => {
    // Arrange / Act
    const { container } = render(<CardElementNotes value="" />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders the notes text under a 'Notes' label", () => {
    // Arrange / Act
    render(<CardElementNotes value="Summoned during the Halloween run." />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Notes")).toBeDefined()
    expect(screen.getByText("Summoned during the Halloween run.")).toBeDefined()
  })
})
