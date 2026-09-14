import type { BpLineItem } from "#/components/buildPoints/bpLineItem.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { isMagician } from "#/components/magician/viewer/magicianUtils.ts"
import { useActiveSkill } from "#/components/runner/runnerUtils.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"
import { SkillKey } from "#/system/model/skills/skillKey.ts"

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
