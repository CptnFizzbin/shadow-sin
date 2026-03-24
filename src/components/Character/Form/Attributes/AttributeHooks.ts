import type { AttrLimits } from "#/components/Character/Form/AttrFormState.ts"
import { AttributeBpAllowance } from "#/components/Character/Form/Attributes/AttributeUtils.ts"
import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { useBuilderStoreSlice } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const useAttributeValueSlice = (attrKey: AttributeKey) => {
  return useCharacterBuilderStoreSlice(
    (state) => state.attributes[attrKey],
    (state, attrValue) => {
      state.attributes[attrKey] = attrValue
      return state
    },
  )
}

export const useAttributeLimitsSlice = (attrKey: AttributeKey) => {
  return useBuilderStoreSlice(
    (state) => state.attributeLimits[attrKey],
    (state, limits: AttrLimits) => {
      state.attributeLimits[attrKey] = limits
      return state
    },
  )
}

export const useSpentBuildPointsSlice = () => {
  return useBuilderStoreSlice(
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
    allowance: AttributeBpAllowance,
  }
}
