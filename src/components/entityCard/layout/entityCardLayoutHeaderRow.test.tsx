import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { EntityCardLayoutHeaderRow } from "./entityCardLayoutHeaderRow.tsx"

describe("EntityCardLayoutHeaderRow", () => {
  it("renders its children", () => {
    render(<EntityCardLayoutHeaderRow>Ares Predator V</EntityCardLayoutHeaderRow>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })
})
