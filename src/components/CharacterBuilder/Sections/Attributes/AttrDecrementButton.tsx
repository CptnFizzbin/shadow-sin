import { Button } from "@mui/material"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import { produce } from "immer"
import type { FC } from "react"

import { useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { useAttr, useAttrInfo } from "#/components/Character/CharacterUtils.ts"
import {
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/CharacterBuilder/BuildPoints/AttributeUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

interface AttrDecrementButtonProps {
  attr: AttributeKey
}

export const AttrDecrementButton: FC<AttrDecrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence cannot be decremented")
  }

  const store = useCharacterSheetContext()
  const attrApi = useAttrInfo(props.attr)
  const attrValue = useAttr(props.attr)

  let disabled = false
  let refund = AttributeBpCostBase
  let label = `${refund} BP`

  if (attrValue >= attrApi.max) {
    refund = AttributeBpCostMaxOut
    label = `${refund} BP`
  }

  if (attrValue <= attrApi.min) {
    disabled = true
    label = "MIN"
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return
    store.setState(produce((sheet) => {
      sheet.attributes[props.attr] -= 1
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
