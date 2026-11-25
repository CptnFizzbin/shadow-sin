import type { FC } from "react"

import { DicePool } from "#/app/components/system/dicePool/dicePool.tsx"
import type { AttributeKey } from "#/data/attributes/attributeKey.ts"
import type { SkillKey } from "#/data/skills/skillKey.ts"
import type { SkillPoolVariant } from "#/state/runner/dicePool/skillDicePools.ts"
import { useActiveSkillDicePool } from "#/state/runner/dicePool/skillDicePools.ts"

interface ActiveSkillVariantDicePoolProps {
  skillKey: SkillKey
  attr: AttributeKey
  variant: SkillPoolVariant
  /** The skill's Specialization, when it covers `variant`: its bonus is added, and it names the pool. */
  specialization?: string
  /** The size of the skill's plain pool. A variant that comes to the same size isn't shown. */
  plainPoolSize: number
}

/**
 * The skill's test as `variant` (e.g. Spellcasting for Combat spells), with the bonuses only that
 * variant gets — or nothing, when those bonuses don't change the pool's size (e.g. a larger focus
 * that doesn't stack with them already applies to the plain pool).
 */
export const ActiveSkillVariantDicePool: FC<ActiveSkillVariantDicePoolProps> = ({
  skillKey,
  attr,
  variant,
  specialization,
  plainPoolSize,
}) => {
  const pool = useActiveSkillDicePool({ skillKey, attrOverride: attr, variant, specialization })
  return pool.size === plainPoolSize ? null : <DicePool pool={pool} />
}
