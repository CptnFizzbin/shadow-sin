import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCardLayoutFooter } from "./entityCardLayoutFooter.tsx"

describe("EntityCardLayoutFooter", () => {
  it("renders its children", () => {
    render(<EntityCardLayoutFooter>SR4A p.427</EntityCardLayoutFooter>, { wrapper: ThemeWrapper })

    expect(screen.getByText("SR4A p.427")).toBeDefined()
  })
})
