import {
  useCharacterBuilderStore,
  useCharacterBuilderStoreContext,
} from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import {
  AttributeKey,
  AttributeLabels,
  AttributeOrder,
} from "#/lib/system/types/attributeKey.ts"

export const attrPointCosts = {
  base: 10,
  maxOut: 25,
  allowance: 200,
}

export interface AttributeRowProps {
  attr: AttributeKey
}

export function useAttributeFormGroup() {
  const store = useCharacterBuilderStoreContext()
  const attributes = useCharacterBuilderStore((state) => state.attributes)
  const bpSpent = useCharacterBuilderStore(
    (state) => state.buildPoints.spent.attributes,
  )

  const hasMaxxedAttr = AttributeOrder.filter(
    (key) => key !== AttributeKey.essence,
  )
    .map((key) => attributes[key])
    .filter(({ max }) => max > 0)
    .some(({ value, max }) => value >= max)

  return {
    store,
    bpSpent: bpSpent,
    bpRemaining: attrPointCosts.allowance - bpSpent,
    hasMaxxedAttr: hasMaxxedAttr,

    attributes: attributes,
  }
}

export function useAttributeRow({ attr }: AttributeRowProps) {
  if (attr === AttributeKey.essence) {
    throw new Error("Essence should not use useAttributeRow")
  }

  const { attributes, ...formGroup } = useAttributeFormGroup()

  return {
    ...formGroup,

    attribute: {
      label: AttributeLabels[attr],
      ...attributes[attr],
    },
  }
}
