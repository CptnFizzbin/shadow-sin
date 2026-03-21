import { Button } from "@mui/material"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import type { FC } from "react"

import type { AttributeRowProps } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { attrPointCosts } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { useCharacterBuilderStoreSlice } from "#/components/Character/Form/CharacterBuilderStoreProvider.tsx"
import { AttributeKey } from "#/lib/system/types/attributeKey.ts"

export const DecrementButton: FC<AttributeRowProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence can not be incremented")
  }

  const attr = props.attr
  const buildPointsSlice = useCharacterBuilderStoreSlice(
    (state) => state.buildPoints,
  )
  const attrSlice = useCharacterBuilderStoreSlice(
    (state) => state.attributes[attr],
  )

  let disabled = false
  let refund = attrPointCosts.base
  let label = `${refund} BP`

  if (attrSlice.state.value >= attrSlice.state.max) {
    refund = attrPointCosts.maxOut
    label = `${refund} BP`
  }

  if (attrSlice.state.value <= attrSlice.state.min) {
    disabled = true
    label = "MIN"
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return

    buildPointsSlice.update((buildPoints) => {
      buildPoints.spent.attributes -= refund
    })

    attrSlice.update((attrState) => {
      attrState.value -= 1
    })
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
