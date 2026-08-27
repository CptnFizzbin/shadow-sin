import type { FC } from "react"

import { DicePool } from "#/components/system/dicePool/dicePool.tsx"
import { useActiveSkillDiceGroup, useAttrDiceGroup, useWoundDiceGroup } from "#/hooks/system/dicePool/useDiceGroup.ts"
import { GameEffectSelectors } from "#/hooks/system/gameEffects/useGameEffects.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { SkillsSelectors } from "#/stores/runner/skills/skillsSlice.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import { GameEffectType } from "#/system/gameEffects/gameEffectType.ts"
import type { SpiritType } from "#/system/magic/spiritData.ts"
import { SpiritTypeLabels } from "#/system/magic/spiritData.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

const STOP_WORDS = new Set(["of", "the", "a", "an", "spirit", "spirits"])

function significantWords(str: string): string[] {
  return str.toLowerCase().split(/\s+/).filter((w) => w.length >= 2 && !STOP_WORDS.has(w))
}

function spiritTypeMatchesSpec(spiritType: SpiritType, specialization: string): boolean {
  const specWords = significantWords(specialization)
  const labelWords = significantWords(SpiritTypeLabels[spiritType])
  return specWords.some((sw) => labelWords.some((lw) => sw.includes(lw) || lw.includes(sw)))
}

interface SummoningDicePoolProps {
  spiritType: SpiritType
  isBound: boolean
}

export const SummoningDicePool: FC<SummoningDicePoolProps> = ({ spiritType, isBound }) => {
  const skillKey = isBound ? SkillKey.binding : SkillKey.summoning
  const poolName = isBound ? "Binding" : "Summoning"

  const magicGroup = useAttrDiceGroup(AttributeKey.magic)
  const skillGroup = useActiveSkillDiceGroup(skillKey)
  const woundGroup = useWoundDiceGroup()

  const specialization = useRunnerSelector(SkillsSelectors.selectSpecialization, { skillName: skillKey })

  const specMods = useRunnerSelector(GameEffectSelectors.selectByType, { gameEffectType: GameEffectType.skillSpecializationMod })

  const specializationApplies = !!specialization && spiritTypeMatchesSpec(spiritType, specialization)

  const totalSpecMod = specializationApplies
    ? specMods
        .filter((e) => e.target === skillKey && e.subTarget === specialization)
        .reduce((sum, e) => sum + e.value, 0)
    : 0

  const specGroup = specializationApplies && specialization
    ? { name: specialization, size: 2 + totalSpecMod }
    : null

  return <DicePool name={poolName} groups={[magicGroup, skillGroup, specGroup, woundGroup]} />
}
