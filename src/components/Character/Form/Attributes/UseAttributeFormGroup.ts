import { useStore } from "@tanstack/react-store"

import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
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
  form: PlayerCharacterForm
  attr: AttributeKey
}

export function useAttributeFormGroup(form: PlayerCharacterForm) {
  const attributes = useStore(form.store, (s) => s.values.attributes)
  const bpSpent = useStore(
    form.store,
    (s) => s.values.buildPoints.spent.attributes,
  )

  const hasMaxxedAttr = useStore(form.store, (s) => {
    return AttributeOrder.filter((key) => key !== AttributeKey.essence)
      .map((key) => s.values.attributes[key])
      .filter(({ max }) => max > 0)
      .some(({ value, max }) => value >= max)
  })

  return {
    bpSpent: bpSpent,
    bpRemaining: attrPointCosts.allowance - bpSpent,
    hasMaxxedAttr: hasMaxxedAttr,

    attributes: attributes,
  }
}

export function useAttributeRow({ attr, form }: AttributeRowProps) {
  if (attr === AttributeKey.essence) {
    throw new Error("Essence should not use useAttributeRow")
  }

  const { attributes, ...formGroup } = useAttributeFormGroup(form)

  return {
    ...formGroup,

    attribute: {
      label: AttributeLabels[attr],
      ...attributes[attr],
    },
  }
}
