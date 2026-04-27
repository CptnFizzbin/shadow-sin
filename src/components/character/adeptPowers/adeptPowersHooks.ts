import { useSelector } from "@tanstack/react-store"

import { selectAllAdeptPowers } from "#/components/character/adeptPowers/adeptPowersSelectors.ts"
import { useAdeptPowersStore } from "#/components/character/adeptPowers/useAdeptPowersStore.ts"
import { useAttr } from "#/components/character/characterUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

export const usePowerPoints = () => {
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useSelector(adeptPowersStore, selectAllAdeptPowers)
  const magicAttr = useAttr(AttributeKey.magic)

  const used = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)

  return { max: magicAttr, used }
}
