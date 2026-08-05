import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementQuantity } from "./cardElementQuantity.tsx"

describe("CardElementQuantity", () => {
  it("renders the quantity when more than one", () => {
    render(<CardElementQuantity value={3} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("x3")).toBeDefined()
  })

  it("renders nothing for a single item", () => {
    const { container } = render(<CardElementQuantity value={1} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })

  it("renders nothing when there is no value", () => {
    const { container } = render(<CardElementQuantity value={undefined} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
