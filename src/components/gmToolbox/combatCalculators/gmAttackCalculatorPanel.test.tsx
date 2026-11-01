import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { GmAttackCalculatorPanel } from "./gmAttackCalculatorPanel.tsx"

const renderPanel = () => render(<GmAttackCalculatorPanel />, { wrapper: ThemeWrapper })

const poolTotal = (poolLabel: string) => screen.getByText(poolLabel).nextElementSibling?.textContent

const setCounter = (label: string, value: number) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value: String(value) } })

describe("GmAttackCalculatorPanel", () => {
  it("renders without a Runner store and sums the hand-entered attack dice", () => {
    // Arrange
    renderPanel()

    // Act
    setCounter("Attribute (usually Agility)", 5)
    setCounter("Combat Skill", 4)

    // Assert
    expect(poolTotal("Attack Test")).toBe("9")
  })

  it("applies the wound modifier and checked ranged modifiers", () => {
    // Arrange
    renderPanel()
    setCounter("Attribute (usually Agility)", 5)
    setCounter("Combat Skill", 4)

    // Act
    setCounter("Wound Modifier", 1)
    fireEvent.click(screen.getByLabelText(/firing while running/i))

    // Assert
    expect(poolTotal("Attack Test")).toBe("6")
  })

  it.each([
    { rangeBand: "Short", expectedTotal: "9" },
    { rangeBand: "Medium", expectedTotal: "8" },
    { rangeBand: "Long", expectedTotal: "6" },
    { rangeBand: "Extreme", expectedTotal: "3" },
  ])("applies the $rangeBand range band", ({ rangeBand, expectedTotal }) => {
    // Arrange
    renderPanel()
    setCounter("Attribute (usually Agility)", 5)
    setCounter("Combat Skill", 4)

    // Act
    fireEvent.click(screen.getByLabelText(new RegExp(`^${rangeBand} \\(`)))

    // Assert
    expect(poolTotal("Attack Test")).toBe(expectedTotal)
  })

  it("defaults the range band to Short", () => {
    // Arrange
    renderPanel()

    // Act
    const shortRange = screen.getByLabelText(/^Short \(/)

    // Assert
    expect((shortRange as HTMLInputElement).checked).toBe(true)
  })

  it("switches to the melee modifier table and clears ranged selections", () => {
    // Arrange
    renderPanel()
    setCounter("Attribute (usually Agility)", 5)
    setCounter("Combat Skill", 4)
    fireEvent.click(screen.getByLabelText(/firing while running/i))

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Melee" }))

    // Assert
    expect(screen.queryByLabelText(/firing while running/i)).toBeNull()
    expect(screen.getByLabelText(/superior position/i)).toBeTruthy()
    expect(poolTotal("Attack Test")).toBe("9")
  })

  it("shows the entered Damage Value before the Attack Test is rolled", () => {
    // Arrange
    renderPanel()

    // Act
    fireEvent.change(screen.getByLabelText("Damage Value"), { target: { value: "8P" } })

    // Assert
    expect(screen.getByText("8P")).toBeTruthy()
  })
})
