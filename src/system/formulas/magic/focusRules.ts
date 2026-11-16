import { getItemState } from "#/system/formulas/items/itemStateRules.ts"
import { DicePoolId } from "#/system/model/gameEffects/dicePoolId.ts"
import type { DicePoolModEffect } from "#/system/model/gameEffects/gameEffectData.ts"
import { GameEffectType } from "#/system/model/gameEffects/gameEffectType.ts"
import { ItemState } from "#/system/model/items/itemState.ts"
import type { FocusData } from "#/system/model/items/magicalData.ts"
import { focusBondingKarmaMultiplier, FocusType } from "#/system/model/magic/focusData.ts"

/** The Karma it costs to Bond `focus`: its Force times its type's multiplier. */
export function getFocusBondingCost(focus: Pick<FocusData, "focusType" | "force">): number {
  return Math.max(0, focus.force) * focusBondingKarmaMultiplier[focus.focusType]
}

/** Whether `focus`'s Game Effects apply: only while it is both Bonded and Equipped. */
export function focusEffectsApply(focus: Pick<FocusData, "bonded" | "state">): boolean {
  return !!focus.bonded && getItemState(focus) === ItemState.equipped
}

const poolMod = (target: DicePoolId, value: number, subTarget?: string): DicePoolModEffect => ({
  type: GameEffectType.dicePoolMod,
  target,
  value,
  ...(subTarget === undefined ? {} : { subTarget }),
})

/**
 * The Game Effects `focus` grants while it applies: +Force dice to the tests its type covers,
 * narrowed to its linked spell category, spirit type, or (for a Weapon Focus) the weapon it is
 * attached to. A Focus missing the link its type needs, and a Sustaining Focus, grant none.
 */
export function getFocusGameEffects(focus: FocusData): DicePoolModEffect[] {
  const { force, spellCategory, spiritType } = focus
  if (force <= 0) return []

  switch (focus.focusType) {
    case FocusType.Spellcasting:
      return spellCategory ? [poolMod(DicePoolId.spellcasting, force, spellCategory)] : []
    case FocusType.Counterspelling:
      return spellCategory ? [poolMod(DicePoolId.counterspelling, force, spellCategory)] : []
    case FocusType.Sustaining:
      return []
    case FocusType.Summoning:
      return spiritType ? [poolMod(DicePoolId.summoning, force, spiritType)] : []
    case FocusType.Banishing:
      return spiritType ? [poolMod(DicePoolId.banishing, force, spiritType)] : []
    case FocusType.Binding:
      return spiritType ? [poolMod(DicePoolId.binding, force, spiritType)] : []
    case FocusType.Weapon: {
      const weaponId = focus.items.parentId
      return weaponId ? [poolMod(DicePoolId.attack, force, weaponId)] : []
    }
    case FocusType.Power:
      return [poolMod(DicePoolId.magicTests, force)]
  }
}

/** How a Runner's Bonded foci measure up against the Bonded Foci Limit and the Foci Force Limit. */
export interface BondedFociLimits {
  bondedCount: number
  /** The Bonded Foci Limit: the Runner's Magic. */
  maxBondedCount: number
  totalForce: number
  /** The Foci Force Limit: the Runner's Magic × 5. */
  maxTotalForce: number
  isOverCountLimit: boolean
  isOverForceLimit: boolean
}

/** Checks the Bonded foci among `foci` against the limits a Runner with `magic` can sustain. */
export function getBondedFociLimits(foci: Pick<FocusData, "bonded" | "force">[], magic: number): BondedFociLimits {
  const bonded = foci.filter((focus) => focus.bonded)
  const bondedCount = bonded.length
  const totalForce = bonded.reduce((sum, focus) => sum + Math.max(0, focus.force), 0)
  const maxBondedCount = Math.max(0, magic)
  const maxTotalForce = maxBondedCount * 5

  return {
    bondedCount,
    maxBondedCount,
    totalForce,
    maxTotalForce,
    isOverCountLimit: bondedCount > maxBondedCount,
    isOverForceLimit: totalForce > maxTotalForce,
  }
}
