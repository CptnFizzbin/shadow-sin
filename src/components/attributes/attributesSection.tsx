import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useCharacterSheet } from "#/components/character/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import {
  AttributeKey,
  AttributeLabels,
  MentalAttributes,
  PhysicalAttributes,
  SpecialAttributes,
} from "#/lib/system/attributeKey.ts"

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
    <Stack direction="row" gap={0.5}>
      {attributes.map((attribute) => (
        <Stack key={attribute.key} flexGrow={1} alignItems="center">
          <Label label={AttributeLabels[attribute.key]} variant="outlined" />
          <Typography>{attribute.value}</Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export interface AttributesSectionProps {
  showLabels?: boolean
}

export const AttributesSection: FC<AttributesSectionProps> = ({
  showLabels = true,
}) => {
  return (
    <Stack>
      <Stack>
        {showLabels && <Label label="Physical" />}
        <AttrList attrKeys={PhysicalAttributes} />
      </Stack>

      <Stack>
        {showLabels && <Label label="Mental" />}
        <AttrList attrKeys={MentalAttributes} />
      </Stack>

      <Stack>
        {showLabels && <Label label="Special" />}
        <AttrList
          attrKeys={SpecialAttributes.filter((k) => k !== AttributeKey.essence)}
        />
      </Stack>
    </Stack>
  )
}
