import { LinearProgress } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { AttributeBpAllowance } from "#/components/CharacterBuilder/Attributes/AttributeUtils.ts"
import { AttributesList } from "#/components/CharacterBuilder/Attributes/AttributesList.tsx"
import { useAttributeFormGroup } from "#/components/CharacterBuilder/Attributes/UseAttributeFormGroup.ts"
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
      <Box alignSelf={"flex-end"}>
        <BuildPoints value={bpSpent} total={AttributeBpAllowance} />
      </Box>

      <LinearProgress
        variant="determinate"
        value={getProgress(bpSpent, AttributeBpAllowance)}
        sx={{ height: 8, borderRadius: 1, width: "100%" }}
      />

      <AttributesList attributeKeys={attrRows} />
    </Stack>
  )
}
