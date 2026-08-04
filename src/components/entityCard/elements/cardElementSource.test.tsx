import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementSource } from "./cardElementSource.tsx"

describe("CardElementSource", () => {
  it("renders the formatted source", () => {
    render(<CardElementSource source={{ book: "SR4A", page: 427 }} />, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })

  it("renders nothing when there is no source", () => {
    const { container } = render(<CardElementSource source={null} />, { wrapper: ThemeWrapper })

    expect(container.firstChild).toBeNull()
  })
})
