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
}

/** The skill's test as `variant` (e.g. Spellcasting for Combat spells), with the bonuses only that variant gets. */
export const ActiveSkillVariantDicePool: FC<ActiveSkillVariantDicePoolProps> = ({ skillKey, attr, variant }) => {
  const pool = useActiveSkillDicePool({ skillKey, attrOverride: attr, variant })
  return <DicePool pool={pool} />
}
