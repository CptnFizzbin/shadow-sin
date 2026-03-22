import { LinearProgress } from "@mui/material"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AttributeRow } from "#/components/Character/Form/Attributes/AttributeRow.tsx"
import { AttributeBpAllowance } from "#/components/Character/Form/Attributes/AttributeUtils.ts"
import { useAttributeFormGroup } from "#/components/Character/Form/Attributes/UseAttributeFormGroup.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import {
  AttributeKey,
  AttributeOrder,
} from "#/lib/system/types/attributeKey.ts"

export const AttributesSection: FC = () => {
  const { bpSpent, attributes } = useAttributeFormGroup()

  const attrRows = AttributeOrder.filter((key) => key !== AttributeKey.essence)
    .map((attr) => ({ attr, ...attributes[attr] }))
    .filter(({ min }) => min >= 1)
    .map(({ attr }) => attr)

  return (
    <Stack gap={1}>
      <BuildPoints
        value={bpSpent}
        total={AttributeBpAllowance}
        variant="caption"
      />

      <LinearProgress
        variant="determinate"
        value={getProgress(bpSpent, AttributeBpAllowance)}
        sx={{ height: 8, borderRadius: 1, width: "100%" }}
      />

      <Stack gap={0.5}>
        {attrRows.map((attr) => (
          <AttributeRow key={attr} attr={attr} />
        ))}
      </Stack>
    </Stack>
  )
}
