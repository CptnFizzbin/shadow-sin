import Stack from "@mui/material/Stack"
import type { FC } from "react"

import type { AttributeKey } from "#/system/attributeKey.ts"

import { AttributeRow } from "./attributeRow.tsx"

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
