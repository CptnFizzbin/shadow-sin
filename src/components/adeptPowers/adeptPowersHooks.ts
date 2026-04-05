import { useStore } from "@tanstack/react-store"

import { useAdeptPowersStore } from "#/components/adeptPowers/useAdeptPowersStore.ts"
import { useAttr } from "#/components/character/characterUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

export const usePowerPoints = () => {
  const adeptPowersStore = useAdeptPowersStore()
  const adeptPowers = useStore(adeptPowersStore, (state) => state)
  const magicAttr = useAttr(AttributeKey.magic)

  const used = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)

  return { max: magicAttr, used }
}
