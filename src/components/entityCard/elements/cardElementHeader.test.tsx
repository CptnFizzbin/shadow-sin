import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementHeader } from "./cardElementHeader.tsx"

describe("CardElementHeader", () => {
  it("renders its children", () => {
    render(<CardElementHeader>Ares Predator V</CardElementHeader>, { wrapper: ThemeWrapper })

    expect(screen.getByText("Ares Predator V")).toBeDefined()
  })
})
