import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementAvailability } from "./cardElementAvailability.tsx"

describe("CardElementAvailability", () => {
  it("renders the availability rating", () => {
    // Arrange / Act
    render(<CardElementAvailability value={{ rating: 8, restricted: true }} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Avail: 8R")).toBeDefined()
  })

  it("renders nothing when there is no availability", () => {
    // Arrange / Act
    const { container } = render(<CardElementAvailability value={undefined} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })
})
