import { Button } from "@mui/material"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import type { FC } from "react"

import { useAttributeSlice } from "#/components/CharacterBuilder/Attributes/AttributeHooks.ts"
import {
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/CharacterBuilder/Attributes/AttributeUtils.ts"
import type { AttributeRowProps } from "#/components/CharacterBuilder/Attributes/UseAttributeState.ts"
import { useCharacterBuilderStoreSlice } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const DecrementButton: FC<AttributeRowProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence cannot be decremented")
  }

  const attrKey = props.attr
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
    (state, buildPoints) => {
      state.buildPoints = buildPoints
      return state
    },
  )
  const attrSlice = useAttributeSlice(attrKey)

  let disabled = false
  let refund = AttributeBpCostBase
  let label = `${refund} BP`

  if (attrSlice.state.value >= attrSlice.state.max) {
    refund = AttributeBpCostMaxOut
    label = `${refund} BP`
  }

  if (attrSlice.state.value <= attrSlice.state.min) {
    disabled = true
    label = "MIN"
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    buildPointsSlice.update((buildPoints) => {
      buildPoints.spent.attributes -= refund
    })

    attrSlice.update((attrState) => {
      attrState.value -= 1
    })
  }
  return (
    <Button
      variant="outlined"
      startIcon={<RiArrowLeftBoxLine />}
      onClick={onClick}
      disabled={disabled}
      sx={{ width: 120 }}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>{label}</span>
    </Button>
  )
}
