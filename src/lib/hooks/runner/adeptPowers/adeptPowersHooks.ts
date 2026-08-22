import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const usePowerPoints = () => {
  const adeptPowers = useRunnerStoreSelector(Selectors.powers.selectPowers)
  const magicAttr = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.magic })

  const used = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)

  return { max: magicAttr, used }
}
