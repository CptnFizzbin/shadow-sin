import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isMagician } from "#/components/runner/magician/magicianUtils.ts"
import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSpellsBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerStoreSelector(Selectors.biology.selectAwakening)
  const spells = useRunnerStoreSelector(Selectors.spells.selectSpells)
  const spellcasting = useActiveSkill(SkillKey.spellcasting)
  const ritualSpellcasting = useActiveSkill(SkillKey.ritualSpellcasting)

  const allowance = (Math.max(spellcasting, ritualSpellcasting) * 2) * BuilderConfig.magic.spells.bpCost
  const spent = spells.length * BuilderConfig.magic.spells.bpCost

  return {
    sectionId: BuilderSectionId.spells,
    allowance,
    spent,
    enabled: isMagician(awakeningType),
  }
}
