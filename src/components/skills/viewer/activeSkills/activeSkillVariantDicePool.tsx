import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import type { SkillPoolVariant } from "#/hooks/runner/skills/skillDicePools.ts"
import { useActiveSkillDicePool } from "#/hooks/runner/skills/skillDicePools.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

interface ActiveSkillVariantDicePoolProps {
  skillKey: SkillKey
  attr: AttributeKey
  variant: SkillPoolVariant
  /** The size of the skill's plain pool. A variant that comes to the same size isn't shown. */
  plainPoolSize: number
}

/**
 * The skill's test as `variant` (e.g. Spellcasting for Combat spells), with the bonuses only that
 * variant gets — or nothing, when those bonuses don't change the pool's size (e.g. a larger focus
 * that doesn't stack with them already applies to the plain pool).
 */
export const ActiveSkillVariantDicePool: FC<ActiveSkillVariantDicePoolProps> = ({ skillKey, attr, variant, plainPoolSize }) => {
  const pool = useActiveSkillDicePool({ skillKey, attrOverride: attr, variant })
  return pool.size === plainPoolSize ? null : <DicePool pool={pool} />
}
