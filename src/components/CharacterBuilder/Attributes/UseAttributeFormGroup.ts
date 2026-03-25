import { AttributeBpAllowance } from "#/components/Character/Form/Attributes/AttributeUtils.ts"
import { useBuildStateStore } from "#/components/CharacterBuilder/BuilderState/BuilderStateProvider.tsx"
import {
  AttributeKey,
  AttributeLabels,
  AttributeOrder,
} from "#/lib/system/types/attributeKey.ts"

export interface AttributeRowProps {
  attr: AttributeKey
}

export function useAttributeFormGroup() {
  const attributes = useBuildStateStore((state) => state.attributes)
  const attributeLimits = useBuildStateStore((state) => state.attributeLimits)
  const bpSpent = useBuildStateStore(
    (state) => state.buildPoints.spent.attributes,
  )

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
