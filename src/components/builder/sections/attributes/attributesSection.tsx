import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { useAllAttrInfos } from "#/components/runner/runnerUtils.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { EditorMode } from "#/lib/contexts/builder/editorMode.tsx"
import { useAttributesBuildPoints } from "#/lib/hooks/builder/buildPoints/useAttributesBuildPoints.ts"
import { getProgress } from "#/lib/progressUtils.ts"
import {
  AttributeKey,
  AttributeOrder,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/system/attributeKey.ts"

import { AttributesList } from "./attributesList.tsx"

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
    <Stack sx={{ gap: 1 }}>
      <EditorMode.IsBuilder>
        <Stack direction="row" sx={{ alignSelf: "flex-end", gap: 1 }}>
          <BuildPoints value={budget.spent} total={budget.limit} /> + <BuildPoints value={specialBp} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={getProgress(budget.spent, budget.limit)}
          sx={{ height: 8, borderRadius: 1, width: "100%" }}
        />
      </EditorMode.IsBuilder>

      <Label label="Pysical" variant="outlined" />
      <AttributesList attributeKeys={physicalAttrs} />

      <Label label="Mental" variant="outlined" />
      <AttributesList attributeKeys={mentalAttrs} />

      <Label label="Special" variant="outlined" />
      <EditorMode.IsBuilder>
        <Label label="Does not count towards BP limit" variant="text" />
      </EditorMode.IsBuilder>
      <AttributesList attributeKeys={specialAttrs} />

    </Stack>
  )
}
