import { LinearProgress } from "@mui/material"
import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useAttributesBuildPoints } from "#/components/CharacterBuilder/Attributes/AttributeHooks.ts"
import { AttributeBpAllowance } from "#/components/CharacterBuilder/Attributes/AttributeUtils.ts"
import { AttributesList } from "#/components/CharacterBuilder/Attributes/AttributesList.tsx"
import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import { AttributeKey, AttributeOrder } from "#/lib/system/attributeKey.ts"

export const AttributesSection: FC = () => {
  const { spent } = useAttributesBuildPoints()
  const attributes = useCharacterBuilderStore((sheet) => sheet.attributes)

  const attrRows = AttributeOrder.filter((key) => key !== AttributeKey.essence)
    .map((attr) => ({ attr, ...attributes[attr] }))
    .filter(({ min }) => min >= 1)
    .map(({ attr }) => attr)

  return (
    <Stack gap={1}>
      <Box alignSelf="flex-end">
        <BuildPoints value={spent} total={AttributeBpAllowance} />
      </Box>

      <LinearProgress
        variant="determinate"
        value={getProgress(spent, AttributeBpAllowance)}
        sx={{ height: 8, borderRadius: 1, width: "100%" }}
      />

      <AttributesList attributeKeys={attrRows} />
    </Stack>
  )
}
