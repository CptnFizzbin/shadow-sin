import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementFooter } from "./cardElementFooter.tsx"

describe("CardElementFooter", () => {
  it("renders its children", () => {
    render(<CardElementFooter>SR4A p.427</CardElementFooter>, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })
})
