import Button from "@mui/material/Button"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import { produce } from "immer"
import type { FC } from "react"

import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { useRunnerAttrInfo } from "#/components/runner/runnerUtils.ts"
import { useEditorMode } from "#/lib/contexts/builder/editorMode.tsx"
import { useRunnerStoreContext } from "#/lib/contexts/runner/runnerStore.context.ts"
import { AttributeKey } from "#/system/attributeKey.ts"

interface AttrDecrementButtonProps {
  attr: AttributeKey
}

export const AttrDecrementButton: FC<AttrDecrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence cannot be decremented")
  }

  const store = useRunnerStoreContext()
  const attrApi = useRunnerAttrInfo(props.attr)
  const attrValue = attrApi.current
  const editorMode = useEditorMode()

  let disabled = false
  let refund = BuilderConfig.attributes.bpCost.base
  let label = `${refund} BP`

  if (attrValue >= attrApi.max) {
    refund = BuilderConfig.attributes.bpCost.maxOut
    label = `${refund} BP`
  }

  if (editorMode.isEdit) {
    label = ""
  }

  if (attrValue <= attrApi.min) {
    disabled = true
    label = "MIN"
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return
    store.setState(produce((sheet) => {
      sheet.attributes[props.attr] = (sheet.attributes[props.attr] ?? 0) - 1
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
