import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { ItemCardSource } from "./itemCard.Source.tsx"

describe("ItemCardSource", () => {
  it("renders its children", () => {
    render(<ItemCardSource source={{ book: "SR4A", page: 427 }} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders nothing when there are no children", () => {
    const { container } = render(<ItemCardSource source={null} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
