import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { CardElementDicePool } from "./cardElementDicePool.tsx"

describe("CardElementDicePool", () => {
  it("renders the pool name and a roll button, passing groups straight through to DicePool", () => {
    // Arrange / Act
    render(
      <CardElementDicePool
        name="Casting Pool"
        groups={[{ name: "Magic", size: 4, type: "attribute" }]}
      />,
      { wrapper: ThemeWrapper },
    )

    // Assert
    expect(screen.getByText("Casting Pool")).toBeDefined()
    expect(screen.getByRole("button", { name: "Roll Casting Pool" })).toBeDefined()
  })
})
