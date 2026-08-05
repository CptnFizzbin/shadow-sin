import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementContent } from "./cardElementContent.tsx"

describe("CardElementContent", () => {
  it("renders its children", () => {
    render(<CardElementContent><span>Freeform body</span></CardElementContent>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Freeform body")).toBeDefined()
  })

  it("renders nothing when there are no children", () => {
    const { container } = render(<CardElementContent>{[]}</CardElementContent>, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
