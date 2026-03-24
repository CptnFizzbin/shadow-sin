import { AttributeBpAllowance } from "#/components/Character/Form/Attributes/AttributeUtils.ts"
import { useCharacterBuilderStore } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { useBuilderStore } from "#/components/CharacterBuilder/BuilderStoreProvider.tsx"
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
  const attributeLimits = useBuilderStore((state) => state.attributeLimits)
  const bpSpent = useBuilderStore((state) => state.buildPoints.spent.attributes)

  const hasMaxxedAttr = AttributeOrder.filter(
    (key) => key !== AttributeKey.essence,
  )
    .map((key) => ({ value: attributes[key], max: attributeLimits[key].max }))
    .filter(({ max }) => max > 0)
    .some(({ value, max }) => value >= max)

  return {
    bpSpent: bpSpent,
    bpRemaining: AttributeBpAllowance - bpSpent,
    hasMaxxedAttr: hasMaxxedAttr,

    attributes,
    attributeLimits,
  }
}

export function useAttributeRow({ attr }: AttributeRowProps) {
  if (attr === AttributeKey.essence) {
    throw new Error("Essence should not use useAttributeRow")
  }

  const { attributes, attributeLimits, ...formGroup } = useAttributeFormGroup()

  return {
    ...formGroup,

    attribute: {
      label: AttributeLabels[attr],
      value: attributes[attr],
      ...attributeLimits[attr],
    },
  }
}
