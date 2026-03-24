import { Button } from "@mui/material"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import type { FC } from "react"

import {
  useAttributeValueSlice,
  useSpentBuildPointsSlice,
} from "#/components/Character/Form/Attributes/AttributeHooks.ts"
import {
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/Character/Form/Attributes/AttributeUtils.ts"
import type { AttributeRowProps } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { useAttributeRow } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const DecrementButton: FC<AttributeRowProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence cannot be decremented")
  }

  const attrKey = props.attr
  const buildPointsSlice = useSpentBuildPointsSlice()
  const attrValueSlice = useAttributeValueSlice(attrKey)
  const { attribute } = useAttributeRow(props)

  let disabled = false
  let refund = AttributeBpCostBase
  let label = `${refund} BP`

  if (attrValueSlice.state >= attribute.max) {
    refund = AttributeBpCostMaxOut
    label = `${refund} BP`
  }

  if (attrValueSlice.state <= attribute.min) {
    disabled = true
    label = "MIN"
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    buildPointsSlice.update((spent) => {
      spent.attributes -= refund
    })

    attrValueSlice.update((attrValue) =>
      attrValue > attribute.min ? attrValue - 1 : attrValue,
    )
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
