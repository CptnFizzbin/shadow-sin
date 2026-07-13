import Button from "@mui/material/Button"
import { RiArrowRightBoxLine } from "@remixicon/react"
import { produce } from "immer"
import type { FC } from "react"

import {
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/builder/buildPoints/attributeUtils.ts"
import { useAttributesBuildPoints } from "#/components/builder/buildPoints/hooks/useAttributesBuildPoints.ts"
import { useHasMaxxedAttribute } from "#/components/runner/attributes/hooks/useHasMaxxedAttribute.ts"
import { useAttr, useAttrInfo } from "#/components/runner/runnerUtils.ts"
import { useRunnerStoreContext } from "#/stores/runner/runnerStore.context.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

interface AttrIncrementButtonProps {
  attr: AttributeKey
}

export const AttrIncrementButton: FC<AttrIncrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence can not be incremented")
  }
  const { budget } = useAttributesBuildPoints()

  const store = useRunnerStoreContext()
  const attrKey = props.attr
  const attrValue = useAttr(attrKey)
  const attrInfo = useAttrInfo(attrKey)
  const hasMaxxedAttr = useHasMaxxedAttribute()

  let disabled = false
  let cost = AttributeBpCostBase
  let label = `${cost} BP`

  const willMaxAttr = attrValue + 1 >= attrInfo.max

  if (willMaxAttr) {
    cost = AttributeBpCostMaxOut
    label = `${cost} BP`
  }

  if (willMaxAttr && hasMaxxedAttr) {
    disabled = true
    label = "---"
  }

  if (attrValue >= attrInfo.max) {
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
      draft.attributes[attrKey] += 1
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
