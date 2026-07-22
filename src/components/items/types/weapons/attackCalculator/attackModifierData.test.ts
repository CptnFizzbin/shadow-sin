import { describe, expect, it } from "vitest"

import type { AttackModifierDefinition } from "./attackModifierData.ts"
import { countActiveModifiers, modifierContribution, sumModifiers } from "./attackModifierData.ts"

const definitions: AttackModifierDefinition[] = [
  { key: "toggle", kind: "toggle", label: "Toggle", value: 2 },
  { key: "stepper", kind: "stepper", label: "Stepper", value: 1, min: 0, max: 4 },
  { key: "note", kind: "note", label: "Note" },
]

describe("modifierContribution", () => {
  it("returns 0 for a note regardless of points", () => {
    // Arrange
    const note = definitions[2]

    // Act / Assert
    expect(modifierContribution(note, 5)).toBe(0)
  })

  it("multiplies points by value for a toggle or stepper", () => {
    // Arrange
    const [toggle, stepper] = definitions

    // Act / Assert
    expect(modifierContribution(toggle, 1)).toBe(2)
    expect(modifierContribution(stepper, 3)).toBe(3)
  })
})

describe("sumModifiers", () => {
  it("sums contributions across all definitions, ignoring unset values", () => {
    // Arrange
    const values = { toggle: 1, stepper: 2 }

    // Act
    const total = sumModifiers(definitions, values)

    // Assert
    expect(total).toBe(4)
  })

  it("returns 0 when nothing is active", () => {
    // Arrange / Act
    const total = sumModifiers(definitions, {})

    // Assert
    expect(total).toBe(0)
  })
})

describe("countActiveModifiers", () => {
  it("counts only non-zero, non-note entries", () => {
    // Arrange
    const values = { toggle: 1, stepper: 0, note: 1 }

    // Act
    const count = countActiveModifiers(definitions, values)

    // Assert
    expect(count).toBe(1)
  })
})
