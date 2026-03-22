import { AttributeMaxBp } from "#/components/Character/Form/Attributes/AttributeUtils.ts"
import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const useAttributeSlice = (attrKey: AttributeKey) => {
  return useCharacterBuilderStoreSlice(
    (state) => state.attributes[attrKey],
    (state, attr) => {
      state.attributes[attrKey] = attr
      return state
    },
  )
}

export const useSpentBuildPointsSlice = () => {
  return useCharacterBuilderStoreSlice(
    (state) => state.buildPoints.spent,
    (state, spent) => {
      state.buildPoints.spent = spent
      return state
    },
  )
}

export const useAttributesBuildPoints = () => {
  const buildPointsSlice = useSpentBuildPointsSlice()

  return {
    spent: buildPointsSlice.state.attributes,
    allowance: AttributeMaxBp,
  }
}
