import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCardLayoutFooterRow } from "./entityCardLayoutFooterRow.tsx"

describe("EntityCardLayoutFooterRow", () => {
  it("renders its children", () => {
    render(<EntityCardLayoutFooterRow>SR4A p.427</EntityCardLayoutFooterRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })
})
