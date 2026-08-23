import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { isMagician } from "#/components/runner/magician/magicianUtils.ts"
import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { BiologySelectors } from "#/lib/stores/runner/biology/biologySlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { SpellsSelectors } from "#/lib/stores/runner/spells/spellsSlice.selectors.ts"
import { SkillKey } from "#/system/skills/skillKey.ts"

export const useSpellsBuildPoints = (): BpLineItem => {
  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const spells = useRunnerSelector(SpellsSelectors.selectAll)
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
