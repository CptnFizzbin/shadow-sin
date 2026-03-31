import { LinearProgress } from "@mui/material"
import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useAllAttrInfos } from "#/components/Character/CharacterUtils.ts"
import { useAttributesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/UseAttributesBuildPoints.ts"
import { AttributesList } from "#/components/CharacterBuilder/Sections/Attributes/AttributesList.tsx"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import {
  AttributeKey,
  AttributeOrder,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/lib/system/attributeKey.ts"

export const AttributesSection: FC = () => {
  const { budget, specialBp } = useAttributesBuildPoints()
  const attributes = useAllAttrInfos()

  const attrRows: AttributeKey[] = AttributeOrder
    .filter((key) => key !== AttributeKey.essence)
    .map((attr) => ({ attr, ...attributes[attr] }))
    .filter(({ min }) => min >= 1)
    .map(({ attr }) => attr)

  const physicalAttrs = PhysicalAttributes.filter((attr) => attrRows.includes(attr))
  const mentalAttrs = MentalAttributes.filter((attr) => attrRows.includes(attr))
  const specialAttrs = SpecialAttributes.filter((attr) => attrRows.includes(attr))

  return (
    <Grid spacing={1} columns={{ xs: 1, md: 3 }} container>
      <Grid size={3}>
        <Stack gap={1}>
          <Stack direction="row" alignSelf="flex-end" gap={1}>
            <BuildPoints value={budget.spent} total={budget.limit} /> + <BuildPoints value={specialBp} />
          </Stack>

          <LinearProgress
            variant="determinate"
            value={getProgress(budget.spent, budget.limit)}
            sx={{ height: 8, borderRadius: 1, width: "100%" }}
          />
        </Stack>
      </Grid>

      <Grid size={1}>
        <Label label="Pysical" variant="outlined" />
        <AttributesList attributeKeys={physicalAttrs} />
      </Grid>

      <Grid size={1}>
        <Label label="Mental" variant="outlined" />
        <AttributesList attributeKeys={mentalAttrs} />
      </Grid>

      <Grid size={1}>
        <Label label="Special" variant="outlined" />
        <AttributesList attributeKeys={specialAttrs} />
        <Label label="Does not count towards BP limit" variant="text" />
      </Grid>

    </Grid>
  )
}
