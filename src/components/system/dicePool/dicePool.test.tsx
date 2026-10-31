import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { DicePool } from "./dicePool.tsx"

describe("DicePool", () => {
  it("lists a group's modifiers in the ledger without adding them to the total", () => {
    // Arrange
    renderWithRunner(
      <DicePool
        pool={{
          id: "test.agility",
          label: "Agility Test",
          groups: [{ name: "AGI", size: 6, type: "attribute", modifiers: [{ name: "Muscle Toner", value: 2 }] }],
          size: 6,
        }}
      />,
    )

    // Act
    fireEvent.click(screen.getByText("Agility Test"))

    // Assert
    expect(screen.getByText("Muscle Toner")).toBeDefined()
    expect(screen.getByText("+2")).toBeDefined()
    expect(screen.getAllByText("6").length).toBeGreaterThan(0)
    expect(screen.queryByText("8")).toBeNull()
  })
})
