import type { FocusData } from "#/system/model/items/magicalData.ts"
import type { SpellData } from "#/system/model/magic/spellData.ts"
import { SpellDuration, SpellSustainTarget } from "#/system/model/magic/spellData.ts"
import { SRC } from "#/system/model/systemValues.ts"

import { canFocusSustainSpell } from "./focusRules.ts"

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
 * The Sustaining Focus among `foci` holding `spell`, or `undefined` while its caster sustains it
 * themselves — including when the focus it names is gone or can no longer hold it.
 */
export function getSustainingFocus<TFocus extends FocusData>(
  spell: Pick<SpellData, "category" | "sustainedBy">,
  foci: TFocus[],
): TFocus | undefined {
  if (!spell.sustainedBy) return undefined
  const focus = foci.find((candidate) => candidate.id === spell.sustainedBy)
  return focus && canFocusSustainSpell(focus, spell) ? focus : undefined
}

/**
 * The dice pool penalty a caster suffers for the `spells` they are sustaining: a fixed penalty per
 * sustained Spell, whoever it is sustained on, except Spells held by a Sustaining Focus among
 * `foci`. `0` while sustaining none.
 */
export function sustainingPenalty(
  spells: Pick<SpellData, "duration" | "sustained" | "category" | "sustainedBy">[],
  foci: FocusData[],
): number {
  const sustainedCount = spells.filter((spell) => (
    isSustainable(spell) && spell.sustained === true && !getSustainingFocus(spell, foci)
  )).length
  // Multiplying 0 by the negative per-spell modifier gives -0, which fails equality checks against 0.
  return sustainedCount === 0 ? 0 : sustainedCount * SRC.Magic.Sustaining.ModifierPerSpell
}
