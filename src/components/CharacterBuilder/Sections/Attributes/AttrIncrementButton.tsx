import { Button } from "@mui/material"
import { RiArrowRightBoxLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import { produce } from "immer"
import type { FC } from "react"

import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import {
  useAttributesBuildPoints,
  useHasMaxxedAttribute,
} from "#/components/CharacterBuilder/Sections/Attributes/AttributeHooks.ts"
import {
  AttributeBpCostBase,
  AttributeBpCostMaxOut
} from "#/components/CharacterBuilder/Sections/Attributes/AttributeUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

interface AttrIncrementButtonProps {
  attr: AttributeKey
}

export const AttrIncrementButton: FC<AttrIncrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence can not be incremented")
  }
  const { budget } = useAttributesBuildPoints()

  const store = useCharacterBuilderStoreContext()
  const attrKey = props.attr
  const attrValue = useStore(store, (state) => state.attributes[attrKey].value)
  const attrMax = useStore(store, (state) => state.attributes[attrKey].max)
  const hasMaxxedAttr = useHasMaxxedAttribute()

  let disabled = false
  let cost = AttributeBpCostBase
  let label = `${cost} BP`

  const willMaxAttr = attrValue + 1 >= attrMax

  if (willMaxAttr) {
    cost = AttributeBpCostMaxOut
    label = `${cost} BP`
  }

  if (willMaxAttr && hasMaxxedAttr) {
    disabled = true
    label = "---"
  }

  if (attrValue >= attrMax) {
    disabled = true
    label = "MAX"
  }

  if (budget.remaining < cost) {
    disabled = true
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    store.setState(produce((draft) => {
      draft.attributes[attrKey].value += 1
    }))
  }

  return (
    <Button
      variant="outlined"
      endIcon={<RiArrowRightBoxLine/>}
      onClick={onClick}
      disabled={disabled}
      sx={{ width: 120 }}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>{label}</span>
    </Button>
  )
}
