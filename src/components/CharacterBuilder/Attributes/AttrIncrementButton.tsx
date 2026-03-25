import { Button } from "@mui/material"
import { RiArrowRightBoxLine } from "@remixicon/react"
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

export const IncrementButton: FC<AttributeRowProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence can not be incremented")
  }

  const { bpRemaining, hasMaxxedAttr, attribute } = useAttributeRow(props)

  const attrKey = props.attr
  const buildPointsSlice = useSpentBuildPointsSlice()
  const attrValueSlice = useAttributeValueSlice(attrKey)

  let disabled = false
  let cost = AttributeBpCostBase
  let label = `${cost} BP`

  const willMaxAttr = attrValueSlice.state + 1 >= attribute.max

  if (willMaxAttr) {
    cost = AttributeBpCostMaxOut
    label = `${cost} BP`
  }

  if (willMaxAttr && hasMaxxedAttr) {
    disabled = true
    label = "---"
  }

  if (attrValueSlice.state >= attribute.max) {
    disabled = true
    label = "MAX"
  }

  if (bpRemaining < cost) {
    disabled = true
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    buildPointsSlice.update((spent) => {
      spent.attributes += cost
    })

    attrValueSlice.update((attrValue) =>
      attrValue < attribute.max ? attrValue + 1 : attrValue,
    )
  }

  return (
    <Button
      variant="outlined"
      endIcon={<RiArrowRightBoxLine />}
      onClick={onClick}
      disabled={disabled}
      sx={{ width: 120 }}
    >
      <span style={{ flexGrow: 1, textAlign: "center" }}>{label}</span>
    </Button>
  )
}
