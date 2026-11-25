import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementSubType } from "./cardElementSubType.tsx"

describe("CardElementSubType", () => {
  it("renders the given label", () => {
    // Arrange / Act
    render(<CardElementSubType label="Heavy Pistol" />, { wrapper: ThemeWrapper })

    // Assert
    expect(screen.getByText("Heavy Pistol")).toBeDefined()
  })
})
