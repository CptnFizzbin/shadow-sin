import type { SpellData } from "#/system/magic/spellData.ts"
import { SpellDrainBaseType } from "#/system/magic/spellData.ts"

function applyMod(base: string | number, mod: number): string {
  if (mod > 0) return `${base}+${mod}`
  if (mod < 0) return `${base}${mod}`
  return `${base}`
}

/** Returns the human-readable drain formula string, e.g. "F/2+2", "F/2", "5-1", "3" */
export function formatDrainFormula(spell: SpellData): string {
  if (spell.drainBaseType === SpellDrainBaseType.Fixed) {
    return applyMod(spell.drainBaseValue ?? 0, spell.drainValueMod)
  }
  return applyMod("F/2", spell.drainValueMod)
}

/** Returns the computed drain value for a given force and spell. Minimum drain is 1. */
export function computeDrainValue(force: number, spell: SpellData): number {
  const base = spell.drainBaseType === SpellDrainBaseType.Fixed
    ? (spell.drainBaseValue ?? 0)
    : Math.floor(force / 2)
  return Math.max(1, base + spell.drainValueMod)
}
