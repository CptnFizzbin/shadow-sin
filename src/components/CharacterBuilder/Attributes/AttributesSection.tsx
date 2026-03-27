import { LinearProgress } from "@mui/material"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useAttributesBuildPoints } from "#/components/CharacterBuilder/Attributes/AttributeHooks.ts"
import { AttributesList } from "#/components/CharacterBuilder/Attributes/AttributesList.tsx"
import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
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
  const attributes = useCharacterBuilderStore((sheet) => sheet.attributes)

  const attrRows = AttributeOrder.filter((key) => key !== AttributeKey.essence)
    .map((attr) => ({ attr, ...attributes[attr] }))
    .filter(({ min }) => min >= 1)
    .map(({ attr }) => attr)

  const physicalAttrs = PhysicalAttributes.filter((attr) => attrRows.includes(attr))
  const mentalAttrs = MentalAttributes.filter((attr) => attrRows.includes(attr))
  const specialAttrs = SpecialAttributes.filter((attr) => attrRows.includes(attr))

  return (
    <Stack gap={1}>
      <Stack direction="row" alignSelf="flex-end" gap={1}>
        <BuildPoints value={budget.spent} total={budget.limit} /> + <BuildPoints value={specialBp} />
      </Stack>

      <LinearProgress
        variant="determinate"
        value={getProgress(budget.spent, budget.limit)}
        sx={{ height: 8, borderRadius: 1, width: "100%" }}
      />

      <Label label="Pysical" variant="outlined" />
      <AttributesList attributeKeys={physicalAttrs} />

      <Label label="Mental" variant="outlined" />
      <AttributesList attributeKeys={mentalAttrs} />

      <Label label="Special" variant="outlined" />
      <Label label="Does not count towards BP limit" variant="text" />
      <AttributesList attributeKeys={specialAttrs} />

    </Stack>
  )
}
