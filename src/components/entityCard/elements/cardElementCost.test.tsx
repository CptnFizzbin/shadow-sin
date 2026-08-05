import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementCost } from "./cardElementCost.tsx"

describe("CardElementCost", () => {
  it("renders the formatted nuyen amount", () => {
    render(<CardElementCost value={1000} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("1,000¥")).toBeDefined()
  })

  it("renders nothing when there is no value", () => {
    const { container } = render(<CardElementCost value={undefined} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
