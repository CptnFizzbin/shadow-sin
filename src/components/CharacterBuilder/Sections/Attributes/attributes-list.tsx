import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AttributeRow } from "#/components/CharacterBuilder/Sections/Attributes/attribute-row.tsx"
import type { AttributeKey } from "#/lib/system/attribute-key.ts"

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
