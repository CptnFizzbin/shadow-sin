import { isMagician } from "#/data/magic/magicianUtils.ts"
import { SkillKey } from "#/data/skills/skillKey.ts"
import { BuilderConfig } from "#/rules/buildPoints/builderConfig.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { useActiveSkill } from "#/state/runner/runnerUtils.ts"
import { SpellsSelectors } from "#/state/runner/spells/spells.selector.ts"

import type { BpLineItem } from "./bpLineItem.ts"

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
