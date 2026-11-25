import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementQuantity } from "./cardElementQuantity.tsx"

describe("CardElementQuantity", () => {
  it("renders the quantity when greater than one", () => {
    // Arrange / Act
    render(<CardElementQuantity value={3} />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("x3")).toBeDefined()
  })

  it("renders nothing when the quantity is one", () => {
    // Arrange / Act
    const { container } = render(<CardElementQuantity value={1} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })

  it("renders nothing when the quantity is undefined", () => {
    // Arrange / Act
    const { container } = render(<CardElementQuantity value={undefined} />, { wrapper: ThemeWrapper })

    // Assert
    expect(container.firstChild).toBeNull()
  })
})
