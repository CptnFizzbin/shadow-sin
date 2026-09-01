import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementRating } from "./cardElementRating.tsx"

describe("CardElementRating", () => {
  it("renders a numeric rating", () => {
    render(<CardElementRating value={4} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Rating: 4")).toBeDefined()
  })

  it("renders a string override value", () => {
    render(<CardElementRating value="Real" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Rating: Real")).toBeDefined()
  })

  it("renders nothing when value is undefined", () => {
    const { container } = render(<CardElementRating value={undefined} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
