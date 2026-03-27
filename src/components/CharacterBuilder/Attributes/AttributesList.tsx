import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AttributeRow } from "#/components/CharacterBuilder/Attributes/AttributeRow.tsx"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"

interface AttributesListProps {
  attributeKeys: AttributeKey[]
}

export const AttributesList: FC<AttributesListProps> = ({ attributeKeys }) => {
  return (
    <Stack gap={0.5}>
      {attributeKeys.map((attr) => (
        <AttributeRow key={attr} attr={attr} />
      ))}
    </Stack>
  )
}
