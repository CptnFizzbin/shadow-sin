import Button from "@mui/material/Button"
import { RiArrowRightBoxLine } from "@remixicon/react"
import { produce } from "immer"
import type { FC } from "react"

import { useAttributesBuildPoints } from "#/components/builder/buildPoints/hooks/useAttributesBuildPoints.ts"
import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { useAttrValue } from "#/components/runner/attributes/attributesProvider.tsx"
import { useHasMaxxedAttribute } from "#/components/runner/attributes/hooks/useHasMaxxedAttribute.ts"
import { useAttrInfo } from "#/components/runner/runnerUtils.ts"
import { useEditorMode } from "#/stores/builder/editorMode.tsx"
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
  const editorMode = useEditorMode()

  const store = useRunnerStoreContext()
  const attrKey = props.attr
  const attrValue = useAttrValue(attrKey)
  const attrInfo = useAttrInfo(attrKey)
  const hasMaxxedAttr = useHasMaxxedAttribute()

  let disabled = false
  let cost = BuilderConfig.attributes.bpCost.base
  let label = `${cost} BP`

  const willMaxAttr = attrValue + 1 >= attrInfo.max

  if (willMaxAttr) {
    cost = BuilderConfig.attributes.bpCost.maxOut
    label = `${cost} BP`
  }

  if (editorMode.isEdit) {
    label = ""
  }

  if (willMaxAttr && hasMaxxedAttr && !editorMode.isEdit) {
    disabled = true
    label = "---"
  }

  if (attrValue >= attrInfo.max) {
    disabled = true
    label = "MAX"
  }

  if (budget.remaining < cost && !editorMode.isEdit) {
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
