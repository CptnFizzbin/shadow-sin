import { Button } from "@mui/material"
import { RiArrowRightBoxLine } from "@remixicon/react"
import type { FC } from "react"

import type { AttributeRowProps } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import {
  attrPointCosts,
  useAttributeRow,
} from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const IncrementButton: FC<AttributeRowProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence can not be incremented")
  }

  const { bpRemaining, hasMaxxedAttr } = useAttributeRow(props)

  const attrKey = props.attr
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
    (state, buildPoints) => {
      state.buildPoints = buildPoints
      return state
    },
  )
  const attrSlice = useCharacterBuilderStoreSlice(
    (state) => state.attributes[attrKey],
    (state, attr) => {
      state.attributes[attrKey] = attr
      return state
    },
  )

  let disabled = false
  let cost = attrPointCosts.base
  let label = `${cost} BP`

  const willMaxAttr = attrSlice.state.value + 1 >= attrSlice.state.max

  if (willMaxAttr) {
    cost = attrPointCosts.maxOut
    label = `${cost} BP`
  }

  if (willMaxAttr && hasMaxxedAttr) {
    disabled = true
    label = "---"
  }

  if (attrSlice.state.value >= attrSlice.state.max) {
    disabled = true
    label = "MAX"
  }

  if (bpRemaining < cost) {
    disabled = true
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    buildPointsSlice.update((buildPoints) => {
      buildPoints.spent.attributes += cost
    })

    attrSlice.update((attrState) => {
      attrState.value += 1
    })
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
