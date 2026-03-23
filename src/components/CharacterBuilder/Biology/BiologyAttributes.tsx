import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { createAttrFormState } from "#/components/CharacterBuilder/AttrFormState.ts"
import { useCharacterBuilderStore } from "#/components/CharacterBuilder/CharacterBuilderStoreProvider.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import { metatypes } from "#/lib/system/types/MetatypeData.ts"
import type { AttributeKey } from "#/lib/system/types/attributeKey.ts"
import {
  AttributeLabels,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/lib/system/types/attributeKey.ts"
import { awakenings } from "#/lib/system/types/awakeningType.ts"

export const BiologyAttributes: FC = () => {
  return (
    <Stack gap={1}>
      <Label label="min / max (aug)" variant="outlined" />

      <Stack gap={0.5}>
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
  const metatypeName = useCharacterBuilderStore((state) => state.metatype)
  const metatype = metatypes[metatypeName]

  const awakeningType = useCharacterBuilderStore((state) => state.awakening)
  const awakening = awakenings[awakeningType]

  const attributes = attrKeys
    .map((attr) => {
      const state = createAttrFormState({ attr, metatype, awakening })
      return { label: AttributeLabels[attr], ...state }
    })
    .filter((attr) => attr.min !== 0)

  return (
    <Stack direction="row" gap={0.5}>
      {attributes.map((attr) => (
        <Stack key={attr.label} flexGrow={1} alignItems="center">
          <Label label={attr.label} variant="outlined" />
          <Typography variant="body2">
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
