import { fireEvent, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { renderWithRunner } from "#testUtils/renderUtils.tsx"

import { DicePool } from "./dicePool.tsx"

describe("DicePool", () => {
  it("lists a group's breakdown as an indented list without adding it to the total", () => {
    // Arrange
    renderWithRunner(
      <DicePool
        pool={{
          id: "test.agility",
          label: "Agility Test",
          groups: [{
            name: "AGI",
            size: 6,
            type: "attribute",
            breakdown: { rawValue: 4, modifiers: [{ name: "Muscle Toner", value: 2 }], rating: 6 },
          }],
          size: 6,
        }}
      />,
    )

    // Act
    fireEvent.click(screen.getByText("Agility Test"))

    // Assert
    const items = within(screen.getByRole("list")).getAllByRole("listitem")
    expect(items.map((item) => item.textContent)).toEqual(["Raw Value4", "Muscle Toner+2"])
    expect(screen.getAllByText("6").length).toBeGreaterThan(0)
    expect(screen.queryByText("8")).toBeNull()
  })
})
