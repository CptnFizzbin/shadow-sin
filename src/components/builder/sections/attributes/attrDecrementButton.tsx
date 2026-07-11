import Button from "@mui/material/Button"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import { produce } from "immer"
import type { FC } from "react"

import {
  AttributeBpCostBase,
  AttributeBpCostMaxOut,
} from "#/components/builder/buildPoints/attributeUtils.ts"
import { useAttr, useAttrInfo } from "#/components/runner/runnerUtils.ts"
import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { AttributeKey } from "#/system/attributeKey.ts"

interface AttrDecrementButtonProps {
  attr: AttributeKey
}

export const AttrDecrementButton: FC<AttrDecrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence cannot be decremented")
  }

  const store = useRunnerDataContext()
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
