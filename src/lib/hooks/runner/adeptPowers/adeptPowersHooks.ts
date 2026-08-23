import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { PowersSelectors } from "#/lib/stores/runner/powers/powersSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const usePowerPoints = () => {
  const used = useRunnerSelector(PowersSelectors.selectUsed)
  const max = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })

  return { max, used }
}
