import Button from "@mui/material/Button"
import { RiArrowRightBoxLine } from "@remixicon/react"
import type { FC } from "react"

import { BuilderConfig } from "#/components/builder/builderConfig.ts"
import { useEditorMode } from "#/contexts/builder/editorMode.tsx"
import { useAttributesBuildPoints } from "#/hooks/builder/buildPoints/useAttributesBuildPoints.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { RunnerActions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { useRunnerStateDispatch } from "#/state/runnerState.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"

interface AttrIncrementButtonProps {
  attr: AttributeKey
}

export const AttrIncrementButton: FC<AttrIncrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence can not be incremented")
  }
  const { budget } = useAttributesBuildPoints()
  const editorMode = useEditorMode()

  const dispatch = useRunnerStateDispatch()
  const attrKey = props.attr
  const attrInfo = useRunnerSelector(AttrSelectors.selectInfo, { key: attrKey })
  const attrValue = useRunnerSelector(AttrSelectors.selectBase, { key: props.attr })
  const hasMaxxedAttr = useRunnerSelector(AttrSelectors.selectHasMaxxed)

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

  if (willMaxAttr && hasMaxxedAttr && editorMode.isBuilder) {
    disabled = true
    label = "---"
  }

  if (attrValue >= attrInfo.max) {
    disabled = true
    label = "MAX"
  }

  if (budget.remaining < cost && editorMode.isBuilder) {
    disabled = true
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    dispatch(RunnerActions.update((draft) => {
      draft.attributes[attrKey] = (draft.attributes[attrKey] ?? 0) + 1
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
