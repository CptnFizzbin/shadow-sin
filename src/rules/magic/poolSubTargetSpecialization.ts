import { SpellCategory } from "#/system/model/magic/spellData.ts"
import { SpiritType } from "#/system/model/magic/spiritData.ts"

import { spiritTypeMatchesSpecialization } from "./spiritSpecialization.ts"

const isSpellCategory = (value: string): value is SpellCategory =>
  Object.values<string>(SpellCategory).includes(value)

const isSpiritType = (value: string): value is SpiritType => Object.values<string>(SpiritType).includes(value)

/**
 * Whether a Specialization (free text, e.g. "Combat Spells" or "Spirits of Fire") covers a test
 * narrowed to `poolSubTarget`: a spell category or a spirit type. Nothing else, such as a weapon id,
 * is covered by a Specialization.
 */
export function specializationCoversPoolSubTarget(specialization: string | undefined, poolSubTarget: string | undefined): boolean {
  if (!specialization || !poolSubTarget) return false
  if (isSpellCategory(poolSubTarget)) {
    return specialization.toLowerCase().split(/\s+/).includes(poolSubTarget.toLowerCase())
  }
  if (isSpiritType(poolSubTarget)) return spiritTypeMatchesSpecialization(poolSubTarget, specialization)
  return false
}
