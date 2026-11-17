import type { SpellData } from "#/system/model/magic/spellData.ts"
import { SpellDuration, SpellSustainTarget } from "#/system/model/magic/spellData.ts"
import { SRC } from "#/system/model/systemValues.ts"

/** Whether a Spell can be sustained after casting — only Spells with a Sustained duration can. */
export function isSustainable(spell: Pick<SpellData, "duration">): boolean {
  return spell.duration === SpellDuration.Sustained
}

/** Whether a Spell grants any Game Effects. */
export function hasSpellEffects(spell: Pick<SpellData, "effects">): boolean {
  return (spell.effects?.length ?? 0) > 0
}

/**
 * Whether a Spell's Game Effects apply to its caster. A sustainable Spell applies them only while
 * it is sustained on its caster (`sustainedOn` absent or `Self`); any other Spell always applies them.
 */
export function spellEffectsApply(spell: Pick<SpellData, "duration" | "sustained" | "sustainedOn">): boolean {
  if (!isSustainable(spell)) return true
  return spell.sustained === true && spell.sustainedOn !== SpellSustainTarget.Other
}

/**
 * The dice pool penalty a caster suffers for the `spells` they are sustaining: a fixed penalty per
 * sustained Spell, whoever it is sustained on. `0` while sustaining none.
 */
export function sustainingPenalty(spells: Pick<SpellData, "duration" | "sustained">[]): number {
  // TODO: leave out spells held by a Sustaining Focus once a Spell can record the focus sustaining it.
  const sustainedCount = spells.filter((spell) => isSustainable(spell) && spell.sustained === true).length
  // Multiplying 0 by the negative per-spell modifier gives -0, which fails equality checks against 0.
  return sustainedCount === 0 ? 0 : sustainedCount * SRC.Magic.Sustaining.ModifierPerSpell
}
