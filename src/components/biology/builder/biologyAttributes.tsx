import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { createAttrInfo } from "#/components/attributes/viewer/attributeInfo.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { BiologySelectors } from "#/state/runner/biology/biology.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { AiAttrFormulas } from "#/system/formulas/attributes/aiAttrFormulas.ts"
import type { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import { AttributeLabels, MentalAttributes, PhysicalAttributes, SpecialAttributes } from "#/system/model/attributes/attributeKey.ts"
import { metatypes } from "#/system/model/biology/metatypeData.ts"
import { awakenings } from "#/system/model/magic/awakeningType.ts"

export const BiologyAttributes: FC = () => {
  return (
    <Stack>
      <Label label="min / max (aug)" />

      <Stack sx={{ gap: 0 }}>
        <AttrList attrKeys={PhysicalAttributes} />
        <AttrList attrKeys={MentalAttributes} />
        <AttrList attrKeys={SpecialAttributes} />
      </Stack>
    </Stack>
  )
}

interface AttrListProps {
  attrKeys: readonly AttributeKey[]
}

const AttrList: FC<AttrListProps> = ({ attrKeys }) => {
  const attrValues = useRunnerSelector(AttrSelectors.selectAll)

  const metatypeName = useRunnerSelector(BiologySelectors.selectMetatype)
  const metatype = metatypes[metatypeName]

  const awakeningType = useRunnerSelector(BiologySelectors.selectAwakening)
  const awakening = awakenings[awakeningType]

  const attributes = attrKeys
    .map((attr) => {
      const value = attrValues[attr] || 0
      const state = createAttrInfo({ attr, value, metatype, awakening })

      const edgeMaxOverride = AiAttrFormulas.getEdgeMaxOverride(attr, metatypeName, attrValues)
      if (edgeMaxOverride !== undefined) {
        return { label: AttributeLabels[attr], ...state, max: edgeMaxOverride, augMax: edgeMaxOverride }
      }

      return { label: AttributeLabels[attr], ...state }
    })
    .filter((attr) => attr.min !== 0)

  return (
    <Stack direction="row" sx={{ gap: 0.5 }}>
      {attributes.map((attr) => (
        <Stack key={attr.label} sx={{ flexGrow: 1, alignItems: "center", gap: 0.5 }}>
          <Label label={attr.label} variant="outlined" />
          <Typography>
            {attr.min}
            /
            {attr.max}
            {" "}
            {(attr.augMax || 0) >= 1 && <>({attr.augMax})</>}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
