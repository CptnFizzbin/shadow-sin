import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardLayoutFooterRow } from "./cardLayoutFooterRow.tsx"

describe("Card.Layout.FooterRow", () => {
  it("renders its children", () => {
    render(<CardLayoutFooterRow>SR4A p.427</CardLayoutFooterRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })
})
