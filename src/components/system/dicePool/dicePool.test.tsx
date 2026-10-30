import { fireEvent, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { runnerDataFactory } from "#/system/model/runnerData.factory.ts"
import { renderWithProviders, renderWithRunner } from "#testUtils/renderUtils.tsx"

import { DicePool } from "./dicePool.tsx"

describe("DicePool", () => {
  it("lists a group's modifiers in the ledger without adding them to the total", () => {
    // Arrange
    renderWithRunner(
      <DicePool
        name="Agility Test"
        groups={[{ name: "AGI", size: 6, type: "attribute", modifiers: [{ name: "Muscle Toner", value: 2 }] }]}
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

  it("doesn't add a Wound group of its own", () => {
    // Arrange
    const runner = runnerDataFactory({ afterBuild: (s) => {
      s.damage.physical = 3
    } })
    renderWithProviders(
      <DicePool name="Agility Test" groups={[{ name: "AGI", size: 4, type: "attribute" }]} />,
      { runner },
    )

    // Act
    fireEvent.click(screen.getByText("Agility Test"))

    // Assert
    expect(screen.queryByText("Wound")).toBeNull()
  })
})
