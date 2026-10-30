import type { DiceGroup } from "#/components/system/dicePool/diceGroup.tsx"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { DicePoolSelectors } from "#/state/runner/dicePool/dicePool.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SkillKey } from "#/system/model/skills/skillKey.ts"

/** @deprecated - use `useEntitySelector(DicePoolSelectors.selectAttrGroup, { attr })` instead */
export function useAttrDiceGroup(attrKey: AttributeKey): DiceGroup {
  return useEntitySelector(DicePoolSelectors.selectAttrGroup, { attr: attrKey })
}

/** @deprecated - use `useRunnerSelector(DicePoolSelectors.selectActiveSkillGroup, { skill, excludeDefaulting })` instead */
export function useActiveSkillDiceGroup(
  skillKey: SkillKey,
  { defaulting = true }: { defaulting?: boolean } = {},
): DiceGroup {
  return useRunnerSelector(DicePoolSelectors.selectActiveSkillGroup, { skill: skillKey, excludeDefaulting: !defaulting })
}

/** @deprecated - use `useRunnerSelector(DicePoolSelectors.selectWoundGroup)` instead */
export function useWoundDiceGroup(): DiceGroup | null {
  return useRunnerSelector(DicePoolSelectors.selectWoundGroup)
}

/** @deprecated - use `useRunnerSelector(DicePoolSelectors.selectEncumbranceGroup)` instead */
export function useEncumbranceDiceGroup(): DiceGroup | null {
  return useRunnerSelector(DicePoolSelectors.selectEncumbranceGroup)
}
