import { Button } from "@mui/material"
import { RiArrowRightBoxLine } from "@remixicon/react"
import { produce } from "immer"
import type { FC } from "react"

import { useHasMaxxedAttribute } from "#/components/Attributes/Hooks/UseHasMaxxedAttribute.ts"
import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { useAttr, useAttrInfo } from "#/components/Character/CharacterUtils.ts"
import {
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/CharacterBuilder/BuildPoints/AttributeUtils.ts"
import { useAttributesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseAttributesBuildPoints.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

interface AttrIncrementButtonProps {
  attr: AttributeKey
}

export const AttrIncrementButton: FC<AttrIncrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence can not be incremented")
  }
  const { budget } = useAttributesBuildPoints()

  const store = useCharacterSheetContext()
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
