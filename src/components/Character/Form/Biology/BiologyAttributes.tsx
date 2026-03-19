import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { createAttrFormState } from "#/components/Character/Form/AttrFormState.ts"
import type { PlayerCharacterForm } from "#/components/Character/Form/UseCharacterForm.ts"
import { Label } from "#/components/UI/Text/Label.tsx"
import {
  type AttributeKey,
  AttributeLabels,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/lib/system/types/attributeKey.ts"
import { awakenings } from "#/lib/system/types/awakeningType.ts"
import { metatypes } from "#/lib/system/types/MetatypeData.ts"

interface MetatypeAttributesProps {
  form: PlayerCharacterForm
}

export const BiologyAttributes: FC<MetatypeAttributesProps> = ({ form }) => {
  return (
    <Stack gap={1}>
      <Label label={"min / max (aug)"} variant="outlined" />

      <Stack gap={0.5}>
        <AttrList attrKeys={PhysicalAttributes} form={form} />
        <AttrList attrKeys={MentalAttributes} form={form} />
        <AttrList attrKeys={SpecialAttributes} form={form} />
      </Stack>
    </Stack>
  )
}

interface AttrListProps {
  form: PlayerCharacterForm
  attrKeys: readonly AttributeKey[]
}

const AttrList: FC<AttrListProps> = ({ attrKeys, form }) => {
  const metatypeName = useStore(form.store, (state) => state.values.metatype)
  const metatype = metatypes[metatypeName]

  const awakeningType = useStore(form.store, (state) => state.values.awakening)
  const awakening = awakenings[awakeningType]

  const attributes = attrKeys
    .map((attr) => {
      const state = createAttrFormState({ attr, metatype, awakening })
      return { label: AttributeLabels[attr], ...state }
    })
    .filter((attr) => attr.min !== 0)

  return (
    <Stack direction={"row"} gap={0.5}>
      {attributes.map((attr) => (
        <Stack key={attr.label} flexGrow={1} alignItems={"center"}>
          <Label label={attr.label} variant="outlined" />
          <Typography variant="body2">
            {attr.min}/{attr.max}{" "}
            {(attr.augMax || 0) >= 1 && <>({attr.augMax})</>}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}
