

import { Button } from "@mui/material"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import type { FC } from "react"

import type {AttributeRowProps} from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts";
import {
  
  attrPointCosts,
  useAttributeRow
} from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const DecrementButton: FC<AttributeRowProps> = (props) => {
  const { attribute } = useAttributeRow(props)

  let disabled = false
  let refund = attrPointCosts.base
  let label = `${refund} BP`

  if (attribute.value >= attribute.max) {
    refund = attrPointCosts.maxOut
    label = `${refund} BP`
  }

  if (attribute.value <= attribute.min) {
    disabled = true
    label = "MIN"
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    props.form.setFieldValue(`buildPoints.spent.attributes`, (prev) => {
      return Math.max(prev - refund, 0)
    })

    props.form.setFieldValue(`attributes.${props.attr}.value`, (prev) => {
      return Math.max(prev - 1, attribute.min)
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
