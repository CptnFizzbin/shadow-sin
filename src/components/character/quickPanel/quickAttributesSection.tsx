import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AttributesSection } from "#/components/attributes/attributesSection.tsx"
import { Label } from "#/components/ui/text/label.tsx"

export const QuickAttributesSection: FC = () => {
  return (
    <Stack gap={0.5}>
      <Label label="Attributes" variant="text" />
      <AttributesSection showLabels={false} />
    </Stack>
  )
}
