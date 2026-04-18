import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AttributeRow } from "#/components/characterBuilder/sections/attributes/attributeRow.tsx"
import type { AttributeKey } from "#/lib/system/attributeKey.ts"

interface AttributesListProps {
  attributeKeys: AttributeKey[]
}

export const AttributesList: FC<AttributesListProps> = ({ attributeKeys }) => {
  return (
    <Stack sx={{ gap: 0.5 }}>
      {attributeKeys.map((attr) => (
        <AttributeRow key={attr} attr={attr} />
      ))}
    </Stack>
  )
}
