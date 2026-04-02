import { LinearProgress } from "@mui/material"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useAllAttrInfos } from "#/components/Character/character-utils.ts"
import { useAttributesBuildPoints } from "#/components/CharacterBuilder/BuildPoints/Hooks/use-attributes-build-points.ts"
import { AttributesList } from "#/components/CharacterBuilder/Sections/Attributes/attributes-list.tsx"
import { Label } from "#/components/UI/Text/label.tsx"
import { BuildPoints } from "#/components/UI/build-points.tsx"
import { getProgress } from "#/lib/progress-utils.ts"
import {
  AttributeKey,
  AttributeOrder,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/lib/system/attribute-key.ts"

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
