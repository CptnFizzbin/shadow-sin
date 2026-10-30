import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { DiceGroupSelectors } from "#/state/runner/diceGroup/diceGroup.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

/** @deprecated - use `useEntitySelector(DiceGroupSelectors.selectAttr, { attr })` instead */
export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup[] {
  return useEntitySelector(DiceGroupSelectors.selectAttr, { attr: attrKey })
}

/** @deprecated - use `useRunnerSelector(DiceGroupSelectors.selectSkill, { skill, excludeDefaulting })` instead */
export function useActiveSkillDiceGroup(
  skillKey: SkillKey,
  { defaulting = true }: { defaulting?: boolean } = {},
): DiceGroup[] {
  return useRunnerSelector(DiceGroupSelectors.selectSkill, { skill: skillKey, excludeDefaulting: !defaulting })
}

/** @deprecated - use `useRunnerSelector(DiceGroupSelectors.selectWound)` instead */
export function useWoundDiceGroup(): DiceGroup[] {
  return useRunnerSelector(DiceGroupSelectors.selectWound)
}

/** @deprecated - use `useRunnerSelector(DiceGroupSelectors.selectEncumbrance)` instead */
export function useEncumbranceDiceGroup(): DiceGroup[] {
  return useRunnerSelector(DiceGroupSelectors.selectEncumbrance)
}
