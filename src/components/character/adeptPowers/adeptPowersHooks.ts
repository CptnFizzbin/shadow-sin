import { useSelector } from "@tanstack/react-store"

import { useAttr } from "#/components/character/attributes/useAttr.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

import { selectAllAdeptPowers } from "./adeptPowersSelectors.ts"
import { useAdeptPowersStore } from "./useAdeptPowersStore.ts"

export const usePowerPoints = () => {
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useSelector(adeptPowersStore, selectAllAdeptPowers)
  const magicAttr = useAttr(AttributeKey.magic)

  const used = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)

  return { max: magicAttr, used }
}
