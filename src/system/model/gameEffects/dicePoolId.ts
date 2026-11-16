/**
 * Pool Ids a `dicePoolMod` GameEffect can target. Its `subTarget`, when set, narrows it further to
 * one spell category, spirit type, or weapon.
 */
export const DicePoolId = {
  /** A Spellcasting test; narrowed by spell category. */
  spellcasting: "magic.spellcasting",
  /** A Counterspelling test; narrowed by spell category. */
  counterspelling: "magic.counterspelling",
  /** A Summoning test; narrowed by spirit type. */
  summoning: "magic.summoning",
  /** A Banishing test; narrowed by spirit type. */
  banishing: "magic.banishing",
  /** A Binding test; narrowed by spirit type. */
  binding: "magic.binding",
  /** Every test whose pool includes the Magic attribute. */
  magicTests: "magic",
  /** An Attack test; narrowed by the attacking weapon's id. */
  attack: "attack",
} as const

export type DicePoolId = typeof DicePoolId[keyof typeof DicePoolId]
