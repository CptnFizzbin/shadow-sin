import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"

interface AttributeValueRowProps {
  values: Partial<Record<AttributeKey, number>>
  attrKeys: readonly AttributeKey[]
}

export const AttributeValueRow: FC<AttributeValueRowProps> = ({ values, attrKeys }) => {
  const visibleKeys = attrKeys.filter((k) => (values[k] ?? 0) !== 0)
  if (visibleKeys.length === 0) return null
  return (
    <Stack direction="row" sx={{ gap: 0.5 }}>
      {visibleKeys.map((key) => (
        <Stack key={key} sx={{ flexGrow: 1, alignItems: "center", gap: 0 }}>
          <Label label={AttributeLabels[key]} variant="text" />
          <Typography>{values[key] ?? 0}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}
