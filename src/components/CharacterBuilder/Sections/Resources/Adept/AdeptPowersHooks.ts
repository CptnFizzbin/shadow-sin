import { useStore } from "@tanstack/react-store"

import { useCharacterSheet } from "#/components/Character/CharacterSheetProvider.tsx"
import { useAttr } from "#/components/Character/CharacterUtils"
import { isAdept } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersUtils.ts"
import { useAdeptPowersStore } from "#/components/CharacterBuilder/Sections/Resources/Adept/UseAdeptPowersStore.ts"
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

export const useAdeptPowersBuildPoints = () => {
  const awakeningType = useCharacterSheet((sheet) => sheet.biology.awakening)

  return {
    label: "Adept Powers",
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
