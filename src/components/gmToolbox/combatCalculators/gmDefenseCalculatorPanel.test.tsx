import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { ThemeWrapper } from "#testUtils/renderUtils.tsx"

import { GmDefenseCalculatorPanel } from "./gmDefenseCalculatorPanel.tsx"

const renderPanel = () => render(<GmDefenseCalculatorPanel />, { wrapper: ThemeWrapper })

const poolTotal = (poolLabel: string) => screen.getByText(poolLabel).nextElementSibling?.textContent

const setCounter = (label: string, value: number) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value: String(value) } })

describe("GmDefenseCalculatorPanel", () => {
  it("renders without a Runner store and sums the hand-entered defense dice", () => {
    // Arrange
    renderPanel()

    // Act
    setCounter("Reaction", 4)
    setCounter("Dodge", 3)

    // Assert
    expect(poolTotal("Defense Test")).toBe("7")
  })

  it("subtracts the wound modifier and applies selected situational modifiers", () => {
    // Arrange
    renderPanel()
    setCounter("Reaction", 4)
    setCounter("Dodge", 3)

    // Act
    setCounter("Wound Modifier", 3)
    fireEvent.click(screen.getByLabelText(/you're running/i))

    // Assert: 4 Reaction + 3 Dodge - 3 wound + 2 running
    expect(poolTotal("Defense Test")).toBe("6")
  })

  it("adds the Full Defense dice when Full Defense is checked", () => {
    // Arrange
    renderPanel()
    setCounter("Reaction", 4)

    // Act
    fireEvent.click(screen.getByLabelText(/full defense/i))
    setCounter("Dodge (Full Defense)", 3)

    // Assert
    expect(poolTotal("Defense Test")).toBe("7")
  })

  it("builds the Damage Resistance Test from Body and Armor", () => {
    // Arrange
    renderPanel()

    // Act
    setCounter("Body", 5)
    setCounter("Armor (Ballistic or Impact)", 6)

    // Assert
    expect(poolTotal("Damage Resistance Test")).toBe("11")
  })

  it("halves Impact armor when resisting an indirect spell", () => {
    // Arrange
    renderPanel()
    fireEvent.click(screen.getByRole("button", { name: "Spell" }))
    fireEvent.click(screen.getByRole("button", { name: "Indirect" }))

    // Act
    setCounter("Body", 4)
    setCounter("Impact Armor", 5)

    // Assert
    expect(poolTotal("Damage Resistance Test")).toBe("6")
  })

  it("reuses the Defense Test to resist a direct spell", () => {
    // Arrange
    renderPanel()
    fireEvent.click(screen.getByRole("button", { name: "Spell" }))
    fireEvent.click(screen.getByRole("button", { name: "Mana (Willpower)" }))

    // Act
    setCounter("Willpower", 5)
    setCounter("Counterspelling", 2)

    // Assert
    expect(poolTotal("Defense Test")).toBe("7")
    expect(poolTotal("Damage Resistance Test")).toBe("7")
  })

  it("replaces the Defense Test with a warning when the defender is unaware", () => {
    // Arrange
    renderPanel()

    // Act
    fireEvent.click(screen.getByLabelText(/unaware of the attack/i))

    // Assert
    expect(screen.queryByText("Defense Test")).toBeNull()
    expect(screen.getByText(/no defense is possible/i)).toBeTruthy()
  })
})
