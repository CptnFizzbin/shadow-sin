import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { DiceRoller } from "#/services/dice/diceRoller.ts"

import { DiceResult, MAX_DICE_PER_ROW } from "./diceResult.tsx"

describe("DiceResult", () => {
  it("renders every die in a 32-die pool", () => {
    // Arrange
    const roller = new DiceRoller().setPoolSize(32)

    // Act
    const { container } = render(<DiceResult roller={roller} iconSize={48} />)

    // Assert
    expect(container.firstElementChild?.querySelectorAll(":scope > svg")).toHaveLength(32)
  })

  it("caps the row width so no more than ten dice fit on a row", () => {
    // Arrange
    const iconSize = 48
    const roller = new DiceRoller().setPoolSize(32)

    // Act
    const { container } = render(<DiceResult roller={roller} iconSize={iconSize} />)

    // Assert
    const diceRow = container.firstElementChild as HTMLElement
    expect(MAX_DICE_PER_ROW).toBe(10)
    expect(getComputedStyle(diceRow).flexWrap).toBe("wrap")
    expect(getComputedStyle(diceRow).maxWidth).toBe(`${iconSize * MAX_DICE_PER_ROW}px`)
  })
})
