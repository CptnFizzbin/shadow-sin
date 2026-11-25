import type { AttributeKey } from "#/data/attributes/attributeKey.ts"
import { DicePoolId, magicalSkillPoolIds } from "#/data/gameEffects/dicePoolId.ts"
import { ItemType } from "#/data/items/itemType.ts"
import { isWeaponData } from "#/data/items/weaponData.ts"
import { SpiritType, SpiritTypePluralLabels } from "#/data/magic/spiritData.ts"
import type { SkillKey } from "#/data/skills/skillKey.ts"
import { skillList } from "#/data/skills/skillList.ts"
import type { DicePoolData } from "#/rules/dicePool/dicePoolData.tsx"
import { DicePoolModSelectors } from "#/state/runner/gameEffects/dicePoolMods.selector.ts"
import { ItemSelectors } from "#/state/runner/items/items.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

import { SkillPoolSelectors } from "./skillPools.selector.ts"

/**
 * Names a skill pool after its skill (and specialization or variant, if any). The pool selectors use
 * fixed ids and labels, and a skill's plain, specialized, and variant pools are shown side by side,
 * keyed by id.
 */
const nameSkillPool = (pool: DicePoolData, name: string, specialization?: string): DicePoolData => ({
  ...pool,
  id: specialization ? `${pool.id}.${name}.${specialization}` : `${pool.id}.${name}`,
  label: specialization ? `${name} (${specialization})` : name,
})

/**
 * A narrower test an Active Skill is rolled as, which some bonus (e.g. a focus) applies to: the
 * skill's test for one spell category or spirit type, or an attack with one weapon.
 */
export interface SkillPoolVariant {
  modPoolId: DicePoolId
  poolSubTarget: string
  /** What the variant is narrowed to, in on-screen words, e.g. "Combat spells" or "Katana". */
  label: string
}

export const useActiveSkillDicePool = (props: {
  skillKey: SkillKey
  specialization?: string
  attrOverride?: AttributeKey
  variant?: SkillPoolVariant
}): DicePoolData => {
  const { skillKey, specialization, attrOverride, variant } = props

  const pool = useRunnerSelector(SkillPoolSelectors.selectActiveSkillTest, {
    skill: skillKey,
    attr: attrOverride ?? skillList[skillKey].attr,
    specialization,
    modPoolId: variant?.modPoolId,
    poolSubTarget: variant?.poolSubTarget,
  })
  // A Specialization names the pool even alongside a variant, since it's the one that covers it.
  return nameSkillPool(pool, skillKey, specialization ?? variant?.label)
}

const isSpiritType = (value: string): value is SpiritType => Object.values<string>(SpiritType).includes(value)

/**
 * The variants of `skillKey`'s test some active bonus applies to: for a magical skill, each spell
 * category or spirit type a focus (or other bonus) covers; for any other skill, each weapon using it
 * that a bonus such as a Weapon Focus reaches.
 */
export const useActiveSkillPoolVariants = (skillKey: SkillKey): SkillPoolVariant[] => {
  const magicalPoolId = magicalSkillPoolIds[skillKey]
  const modPoolId = magicalPoolId ?? DicePoolId.attack
  const subTargets = useRunnerSelector(DicePoolModSelectors.selectSubTargets, { poolId: modPoolId })
  const weapons = useRunnerSelector(ItemSelectors.selectByType, { itemType: ItemType.weapon })

  return subTargets.flatMap((poolSubTarget): SkillPoolVariant[] => {
    if (magicalPoolId) {
      const label = isSpiritType(poolSubTarget) ? SpiritTypePluralLabels[poolSubTarget] : `${poolSubTarget} spells`
      return [{ modPoolId, poolSubTarget, label }]
    }

    const weapon = weapons[poolSubTarget]
    return weapon && isWeaponData(weapon) && weapon.skill === skillKey
      ? [{ modPoolId, poolSubTarget, label: weapon.name }]
      : []
  })
}

export const useKnowledgeSkillDicePool = (props: {
  knowledge: string
  rating: number
  specialization?: string
}): DicePoolData => {
  const { knowledge, rating, specialization } = props
  const pool = useRunnerSelector(SkillPoolSelectors.selectKnowledgeSkillTest, { knowledge, rating, specialization })
  return nameSkillPool(pool, knowledge, specialization)
}

export const useLanguageSkillDicePool = (props: {
  language: string
  /** A native Language skill has no dice pool to roll — it always succeeds automatically. */
  isNative: boolean
  rating: number
  lingo?: string
}): DicePoolData => {
  const { language, isNative, rating, lingo } = props
  const pool = useRunnerSelector(SkillPoolSelectors.selectLanguageSkillTest, { language, isNative, rating, lingo })
  return nameSkillPool(pool, language, lingo)
}
