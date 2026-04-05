import type { SpellData } from "#/lib/system/magic/spellData.ts"

/**
 * Returns the human-readable drain formula string, e.g. "F/2+2", "F/2", "F/2-1"
 */
export function formatDrainFormula(drainValueMod: number): string {
  if (drainValueMod > 0) return `F/2+${drainValueMod}`
  if (drainValueMod < 0) return `F/2${drainValueMod}`
  return "F/2"
}

/**
 * Returns the computed drain value for a given force and spell.
 * Minimum drain is 1.
 */
export function computeDrainValue(force: number, spell: SpellData): number {
  return Math.max(1, Math.ceil(force / 2) + spell.drainValueMod)
}
