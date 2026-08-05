import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { FooterRow } from "./footerRow.tsx"

describe("EntityCardLayoutFooterRow", () => {
  it("renders its children", () => {
    render(<FooterRow>SR4A p.427</FooterRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })
})
