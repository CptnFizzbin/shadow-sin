import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementRating } from "./cardElementRating.tsx"

describe("CardElementRating", () => {
  it("renders a numeric rating", () => {
    render(<CardElementRating value={4} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Rating: 4")).toBeDefined()
  })

  it("renders a sentinel rating", () => {
    render(<CardElementRating value="real" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Rating: real")).toBeDefined()
  })

  it("renders nothing when value is undefined", () => {
    const { container } = render(<CardElementRating value={undefined} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
