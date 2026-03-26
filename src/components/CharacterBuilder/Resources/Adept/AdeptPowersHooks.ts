import {
  useCharacterBuilderStore,
} from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { isAdept } from "#/components/CharacterBuilder/Resources/Adept/AdeptPowersUtils.ts"
import { useBuilderAdeptPowersApi } from "#/components/CharacterBuilder/Resources/Adept/UseAdeptPowersApi.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

export const usePowerPoints = () => {
  const { adeptPowers } = useBuilderAdeptPowersApi()

  const magicAttr = useCharacterBuilderStore(
    (state) => state.attributes[AttributeKey.magic],
  )

  const used = adeptPowers
    .map((power) => power.costPerRating * power.rating)
    .reduce((total, cost) => total + cost, 0)

  return { max: magicAttr.value, used }
}

export const useAdeptPowerWarnings = () => {
  const magicAttribute = useCharacterBuilderStore(
    (state) => state.attributes[AttributeKey.magic],
  )
  const powerPoints = usePowerPoints()

  const warnings: string[] = []

  if (magicAttribute === undefined) {
    warnings.push("Magic attribute is not set.")
  }

  if (powerPoints.used > powerPoints.max) {
    warnings.push(
      `Power points used (${powerPoints.used}) exceeds maximum (${powerPoints.max}).`,
    )
  }

  return warnings
}

export const useAdeptPowersBuildPoints = () => {
  const awakeningType = useCharacterBuilderStore((state) => state.awakening)

  return {
    label: "Adept Powers",
    spent: 0,
    enabled: isAdept(awakeningType),
  }
}
