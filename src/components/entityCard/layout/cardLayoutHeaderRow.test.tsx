import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardLayoutHeaderRow } from "./cardLayoutHeaderRow.tsx"

describe("Card.Layout.HeaderRow", () => {
  it("renders its children", () => {
    render(<CardLayoutHeaderRow>Ares Predator V</CardLayoutHeaderRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })
})
