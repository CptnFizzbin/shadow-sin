import { Button } from "@mui/material"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import type { FC } from "react"

import type { AttributeRowProps } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import {
  attrPointCosts,
  useAttributeRow,
} from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const DecrementButton: FC<AttributeRowProps> = (props) => {
  const { attribute, store } = useAttributeRow(props)

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

    store.setState((prev) => ({
      ...prev,
      buildPoints: {
        ...prev.buildPoints,
        spent: {
          ...prev.buildPoints.spent,
          attributes: Math.max(prev.buildPoints.spent.attributes - refund, 0),
        },
      },
      attributes: {
        ...prev.attributes,
        [props.attr]: {
          ...prev.attributes[props.attr],
          value: Math.max(prev.attributes[props.attr].value - 1, attribute.min),
        },
      },
    }))
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
