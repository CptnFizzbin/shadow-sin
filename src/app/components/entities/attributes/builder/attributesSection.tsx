import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import type { FC } from "react"

import { BuildPoints } from "#/app/components/builder/buildPoints.tsx"
import { getProgress } from "#/common/number/progressUtils.ts"
import {
  AttributeKey,
  MatrixAttributes,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/data/attributes/attributeKey.ts"
import { useAttributesBuildPoints } from "#/state/builder/buildPoints/useAttributesBuildPoints.ts"
import { EditorMode } from "#/state/editor/editorMode.tsx"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { Label } from "#/ui/text/label.tsx"

import { AttributesList } from "./attributesList.tsx"

export const AttributesSection: FC = () => {
  const { budget, specialBp } = useAttributesBuildPoints()
  const attributes = useRunnerSelector(AttrSelectors.selectAllInfo)
  const metatypeIsAi = useRunnerSelector(BiologySelectors.selectIsAiMetaType)

  const attrRows: AttributeKey[] = Object.values(AttributeKey)
    .filter((attr) => attributes[attr].min >= 1)

  const physicalAttrs = PhysicalAttributes.filter((attr) => attrRows.includes(attr))
  const mentalAttrs = MentalAttributes.filter((attr) => attrRows.includes(attr))
  const specialAttrs = SpecialAttributes.filter((attr) => attrRows.includes(attr))
  const matrixAttrs = MatrixAttributes.filter((attr) => attrRows.includes(attr))

  return (
    <Stack>
      <EditorMode.IsBuilder>
        <Stack direction="row" sx={{ alignSelf: "flex-end" }}>
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

      {metatypeIsAi && (
        <>
          <Label label="Matrix" variant="outlined" />
          <Label label="Computed — not purchasable" variant="text" />
          <AttributesList attributeKeys={matrixAttrs} />
        </>
      )}

    </Stack>
  )
}
