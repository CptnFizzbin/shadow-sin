import type { SpellData } from "#/system/magic/spellData.ts"
import { SpellDrainType } from "#/system/magic/spellData.ts"

function applyMod(base: string | number, mod: number): string {
  if (mod > 0) return `${base}+${mod}`
  if (mod < 0) return `${base}${mod}`
  return `${base}`
}

/** Returns the human-readable drain formula string, e.g. "F/2+2", "F/2", "5" */
export function formatDrainFormula(spell: SpellData): string {
  if (spell.drain.type === SpellDrainType.Fixed) {
    return String(spell.drain.value)
  }
  return applyMod("F/2", spell.drain.value)
}

/** Returns the computed drain value for a given force and spell. Minimum drain is 1. */
export function computeDrainValue(force: number, spell: SpellData): number {
  if (spell.drain.type === SpellDrainType.Fixed) {
    return Math.max(1, spell.drain.value)
  }
  return Math.max(1, Math.floor(force / 2) + spell.drain.value)
}
