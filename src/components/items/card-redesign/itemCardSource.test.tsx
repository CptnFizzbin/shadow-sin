import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCardSource } from "./itemCardSource.tsx"

describe("ItemCardSource", () => {
  it("renders its children", () => {
    render(<ItemCardSource>Street Grimoire p.42</ItemCardSource>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Street Grimoire p.42")).toBeDefined()
  })

  it("renders nothing when there are no children", () => {
    const { container } = render(<ItemCardSource />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
