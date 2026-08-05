import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementType } from "./cardElementType.tsx"

describe("CardElementType", () => {
  it("renders the label alone", () => {
    render(<CardElementType label="Weapon" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Weapon")).toBeDefined()
  })

  it("renders the subtype alongside the label when given", () => {
    render(<CardElementType label="Weapon" subtype="Heavy Pistol" />, { wrapper: ThemeWrapper })

    expect(screen.getByText("Weapon — Heavy Pistol")).toBeDefined()
  })
})
