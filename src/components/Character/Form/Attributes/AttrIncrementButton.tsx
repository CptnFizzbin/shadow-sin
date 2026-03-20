import { Button } from "@mui/material"
import { RiArrowRightBoxLine } from "@remixicon/react"
import type { FC } from "react"

import type { AttributeRowProps } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import {
  attrPointCosts,
  useAttributeRow,
} from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const IncrementButton: FC<AttributeRowProps> = (props) => {
  const { bpRemaining, hasMaxxedAttr, attribute, store } =
    useAttributeRow(props)

  let disabled = false
  let cost = attrPointCosts.base
  let label = `${cost} BP`

  const willMaxAttr = attribute.value + 1 >= attribute.max

  if (willMaxAttr) {
    cost = attrPointCosts.maxOut
    label = `${cost} BP`
  }

  if (willMaxAttr && hasMaxxedAttr) {
    disabled = true
    label = "---"
  }

  if (attribute.value >= attribute.max) {
    disabled = true
    label = "MAX"
  }

  if (bpRemaining < cost) {
    disabled = true
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
          attributes: Math.min(
            prev.buildPoints.spent.attributes + cost,
            attrPointCosts.allowance,
          ),
        },
      },
      attributes: {
        ...prev.attributes,
        [props.attr]: {
          ...prev.attributes[props.attr],
          value: Math.min(prev.attributes[props.attr].value + 1, attribute.max),
        },
      },
    }))
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
