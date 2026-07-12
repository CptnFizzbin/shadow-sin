import { useAttr } from "#/components/runner/runnerUtils.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const usePowerPoints = () => {
  const adeptPowers = useRunnerStoreSelector(Selectors.powers.selectPowers)
  const magicAttr = useAttr(AttributeKey.magic)

  const used = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)

  return { max: magicAttr, used }
}
