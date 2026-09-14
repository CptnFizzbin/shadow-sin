export interface ParsedDamage {
  base: number
  suffix: string
}

/**
 * Splits a weapon's damage string (e.g. "4P", "10P(e)") into its leading
 * numeric base and the trailing type/notation suffix. Returns null for
 * damage values with no leading number (e.g. "Special").
 */
export function parseDamageValue(dmg: string): ParsedDamage | null {
  const match = /^(\d+)(.*)$/.exec(dmg.trim())
  if (!match) return null

  return { base: Number(match[1]), suffix: match[2] }
}

/**
 * Applies net hits from an attack test to a weapon's base damage, per the
 * Shadowrun 4e rule that successes on the Attack Test add to the weapon's DV.
 * Returns the original string unchanged if it has no parseable numeric base.
 */
export function applyNetHitsToDamage(dmg: string, netHits: number): string {
  const parsed = parseDamageValue(dmg)
  if (!parsed) return dmg

  return `${Math.max(0, parsed.base + netHits)}${parsed.suffix}`
}
