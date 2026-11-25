import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"

import type { DefenseModifierDatum } from "./defenseCalculatorData.ts"

/** Which Defense Modifiers Table rows are applied, keyed by modifier `id`. */
export interface DefenseModifierSelection {
  /** Whether a toggle or stepper row is checked. */
  toggles: Record<string, boolean>
  /** Unit count of a checked stepper row. */
  steppers: Record<string, number>
  /** Chosen option `key` of a choice row; a missing entry means its first (neutral) option. */
  choices: Record<string, string>
}

export const emptyDefenseModifierSelection: DefenseModifierSelection = { toggles: {}, steppers: {}, choices: {} }

/** The dice groups `selection` adds to a Defense Test, one per applied, non-zero modifier. */
export const defenseModifierGroups = (
  modifiers: DefenseModifierDatum[],
  selection: DefenseModifierSelection,
): DiceGroup[] => modifiers.flatMap((modifier): DiceGroup[] => {
  if (modifier.kind === "toggle") {
    if (!selection.toggles[modifier.id]) return []
    return [{
      id: modifier.id,
      name: modifier.label,
      size: modifier.value,
      color: modifier.value >= 0 ? "success.main" : "error.main",
    }]
  }

  if (modifier.kind === "stepper") {
    const count = selection.steppers[modifier.id] ?? 0
    if (!selection.toggles[modifier.id] || count === 0) return []
    return [{
      id: modifier.id,
      name: `${modifier.label} (${count})`,
      size: modifier.perUnit * count,
      color: "error.main",
    }]
  }

  const chosenKey = selection.choices[modifier.id] ?? modifier.options[0].key
  const chosenOption = modifier.options.find((option) => option.key === chosenKey) ?? modifier.options[0]
  if (chosenOption.value === 0) return []
  return [{
    id: modifier.id,
    name: `${modifier.label}: ${chosenOption.label}`,
    size: chosenOption.value,
    color: chosenOption.value >= 0 ? "success.main" : "error.main",
  }]
})
