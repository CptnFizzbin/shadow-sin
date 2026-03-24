import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreSlice,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const useAdeptPowersSlice = () => {
  return useCharacterBuilderStoreSlice(
    (state) => state.awakened.adeptPowers ?? [],
    (state, adeptPowers) => {
      state.awakened.adeptPowers = adeptPowers
      return state
    },
  )
}

export const usePowerPoints = () => {
  const powers = useAdeptPowersSlice()

  const magicAttrValue = useCharacterBuilderStore(
    (state) => state.attributes[AttributeKey.magic],
  )

  const used = powers.state
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)

  return { max: magicAttrValue, used }
}

export const useAdeptPowerWarnings = () => {
  const magicAttributeValue = useCharacterBuilderStore(
    (state) => state.attributes[AttributeKey.magic],
  )
  const powerPoints = usePowerPoints()

  const warnings: string[] = []

  if (magicAttributeValue === undefined) {
    warnings.push("Magic attribute is not set.")
  }

  if (powerPoints.used > powerPoints.max) {
    warnings.push(
      `Power points used (${powerPoints.used}) exceeds maximum (${powerPoints.max}).`,
    )
  }

  return warnings
}
