import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/components/system/dicePool/useDiceGroup.ts"
import { useGameEffects } from "#/components/system/gameEffects/useGameEffects.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { SpiritTypeLabels } from "#/system/magic/spiritData.ts"
import type { SpiritType } from "#/system/magic/spiritData.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

interface SummoningDicePoolProps {
  spiritType: SpiritType
}

export const SummoningDicePool: FC<SummoningDicePoolProps> = ({ spiritType }) => {
  const magicGroup = useAttrDiceGroup(AttributeKey.magic)
  const summoningGroup = useActiveSkillDiceGroup(SkillKey.summoning)
  const woundGroup = useWoundDiceGroup()

  const specialization = useCharacterSheet((sheet) =>
    sheet.skills.activeSkills.find((s) => s.name === SkillKey.summoning)?.specialization,
  )

  const specMods = useGameEffects(GameEffectType.skillSpecializationMod)

  const spiritLabel = SpiritTypeLabels[spiritType].toLowerCase()
  const specLower = specialization?.toLowerCase() ?? ""
  const specializationApplies =
    !!specialization && (spiritLabel.includes(specLower) || specLower.includes(spiritLabel))

  const totalSpecMod = specializationApplies
    ? specMods
        .filter((e) => e.target === SkillKey.summoning && e.subTarget === specialization)
        .reduce((sum, e) => sum + e.value, 0)
    : 0

  const specGroup = specializationApplies && specialization
    ? { name: specialization, size: 2 + totalSpecMod }
    : null

  return <DicePool name="Summoning" groups={[magicGroup, summoningGroup, specGroup, woundGroup]} />
}
