import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useAllAttrInfos } from "#/components/character/characterUtils.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels, MentalAttributes, PhysicalAttributes, SpecialAttributes } from "#/system/attributeKey.ts"

import { AttributeValueRow } from "./attributeValueRow.tsx"

interface AttrListProps {
  attrKeys: readonly AttributeKey[]
  showMaximums?: boolean
}

const AttrList: FC<AttrListProps> = ({ attrKeys, showMaximums }) => {
  const attrs = useCharacterSheet((s) => s.attributes)
  const attrInfos = useAllAttrInfos()

  if (!showMaximums) {
    return <AttributeValueRow values={attrs} attrKeys={attrKeys} />
  }

  const attributes = attrKeys
    .map((k) => ({ key: k, value: attrs[k] }))
    .filter((it) => it.value !== 0)

  if (attributes.length === 0) return null

  return (
    <Stack direction="row" sx={{ gap: 0.5 }}>
      {attributes.map(({ key, value }) => (
        <Stack key={key} sx={{ flexGrow: 1, alignItems: "center", gap: 0 }}>
          <Label label={AttributeLabels[key]} variant="text" />
          <Typography>
            {value ?? attrInfos[key].min}
            /
            {attrInfos[key].max}
            {" "}
            {(attrInfos[key].augMax || 0) >= 1 && <>({attrInfos[key].augMax})</>}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

interface AttributesSectionProps {
  showMaximums?: boolean
}

export const AttributesSection: FC<AttributesSectionProps> = ({
  showMaximums = false,
}) => {
  return (
    <Stack sx={{ gap: 0, width: 300, margin: "auto" }}>
      {showMaximums && <Label label="min / max (aug)" />}
      <AttrList attrKeys={PhysicalAttributes} showMaximums={showMaximums} />
      <AttrList attrKeys={MentalAttributes} showMaximums={showMaximums} />
      <AttrList attrKeys={SpecialAttributes} showMaximums={showMaximums} />
    </Stack>
  )
}
