import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { createAttrInfo } from "#/components/runner/attributes/attributeInfo.ts"
import { Label } from "#/components/ui/text/label.tsx"
import { useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels, MentalAttributes, PhysicalAttributes, SpecialAttributes } from "#/system/attributeKey.ts"
import { awakenings } from "#/system/awakeningType.ts"
import { metatypes } from "#/system/metatypeData.ts"

export const BiologyAttributes: FC = () => {
  return (
    <Stack sx={{ gap: 1 }}>
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
  const attrValues = useRunnerStoreSelector((sheet) => sheet.attributes)

  const metatypeName = useRunnerStoreSelector((sheet) => sheet.biology.metatype)
  const metatype = metatypes[metatypeName]

  const awakeningType = useRunnerStoreSelector((sheet) => sheet.biology.awakening)
  const awakening = awakenings[awakeningType]

  const attributes = attrKeys
    .map((attr) => {
      const value = attrValues[attr] || 0
      const state = createAttrInfo({ attr, value, metatype, awakening })
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
