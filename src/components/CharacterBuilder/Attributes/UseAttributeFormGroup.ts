import { AttributeBpAllowance } from "#/components/CharacterBuilder/Attributes/AttributeUtils.ts"
import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import {
  AttributeKey,
  AttributeLabels,
  AttributeOrder,
} from "#/lib/system/types/attributeKey.ts"

export interface AttributeRowProps {
  attr: AttributeKey
}

export function useAttributeFormGroup() {
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
    bpSpent: bpSpent,
    bpRemaining: AttributeBpAllowance - bpSpent,
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
