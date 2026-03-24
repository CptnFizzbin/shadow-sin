import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/Character/CharacterStoreProvider.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import {
  AttributeKey,
  AttributeLabels,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/lib/system/types/attributeKey.ts"

interface AttrListProps {
  attrKeys: readonly AttributeKey[]
}

const AttrList: FC<AttrListProps> = ({ attrKeys }) => {
  const attrs = useCharacterSheet((s) => s.attributes)

  const attributes = attrKeys
    .map((k) => ({ key: k, value: attrs[k] }))
    .filter((it) => it.value !== 0)

  if (attributes.length === 0) return null

  return (
    <Stack direction={"row"} gap={0.5}>
      {attributes.map((attribute) => (
        <Stack key={attribute.key} flexGrow={1} alignItems={"center"}>
          <Label label={AttributeLabels[attribute.key]} variant="outlined" />
          <Typography variant="body2">{attribute.value}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export const AttributesSection: FC = () => {
  return (
    <Stack gap={0.5}>
      <Stack gap={0.5}>
        <Label label={"Physical"} />
        <AttrList attrKeys={PhysicalAttributes} />
      </Stack>

      <Stack gap={0.5}>
        <Label label={"Mental"} />
        <AttrList attrKeys={MentalAttributes} />
      </Stack>

      <Stack gap={0.5}>
        <Label label={"Special"} />
        <AttrList
          attrKeys={SpecialAttributes.filter((k) => k !== AttributeKey.essence)}
        />
      </Stack>
    </Stack>
  )
}
