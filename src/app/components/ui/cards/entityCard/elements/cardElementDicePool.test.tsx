import { screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import type { DicePoolData } from "#/components/system/dicePool/dicePoolData.tsx"
import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { CardElementDicePool } from "./cardElementDicePool.tsx"

describe("CardElementDicePool", () => {
  it("renders the pool name and a roll button, passing the pool straight through to DicePool", () => {
    // Arrange
    const pool: DicePoolData = {
      id: "test.casting",
      label: "Casting Pool",
      groups: [{ name: "Magic", size: 4, type: "attribute" }],
      size: 4,
    }

    // Act
    renderWithRunner(<CardElementDicePool pool={pool} />)

    // Assert
    expect(screen.getByText("Casting Pool")).toBeDefined()
    expect(screen.getByRole("button", { name: "Roll Casting Pool" })).toBeDefined()
  })
})
