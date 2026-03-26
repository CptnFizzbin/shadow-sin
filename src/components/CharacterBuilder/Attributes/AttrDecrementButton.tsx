import { Button } from "@mui/material"
import { RiArrowLeftBoxLine } from "@remixicon/react"
import type { FC } from "react"

import { AttributeBpCostBase, AttributeBpCostMaxOut } from "#/components/CharacterBuilder/Attributes/AttributeUtils.ts"
import { useAttrApi } from "#/components/CharacterBuilder/Attributes/UseAttrApi.ts"
import { useCharacterBuilderStoreContext } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

interface AttrDecrementButtonProps {
  attr: AttributeKey
}

export const AttrDecrementButton: FC<AttrDecrementButtonProps> = (props) => {
  if (props.attr === AttributeKey.essence) {
    throw new Error("Essence cannot be decremented")
  }

  const store = useCharacterBuilderStoreContext()
  const attrApi = useAttrApi(props.attr, store)

  let disabled = false
  let refund = AttributeBpCostBase
  let label = `${refund} BP`

  if (attrApi.value >= attrApi.max) {
    refund = AttributeBpCostMaxOut
    label = `${refund} BP`
  }

  if (attrApi.value <= attrApi.min) {
    disabled = true
    label = "MIN"
  }

  const onClick = () => {
    if (disabled) return
    if (props.attr === AttributeKey.essence) return
    attrApi.setValue(attrApi.value - 1)
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
