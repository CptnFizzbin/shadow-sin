import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label.tsx"
import { AttrSelectors, selectAttributes } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels, MentalAttributes, PhysicalAttributes, SpecialAttributes } from "#/system/attributeKey.ts"
import { attrAugmentedMax, attrMin, attrNaturalMax } from "#/system/attributes/attributeCatalog.ts"

import { AttributeValueRow } from "./attributeValueRow.tsx"

interface AttrListProps {
  attrKeys: readonly AttributeKey[]
  showMaximums?: boolean
}

const AttrList: FC<AttrListProps> = ({ attrKeys, showMaximums }) => {
  const attrs = useRunnerStoreSelector(selectAttributes)
  const attrInfos = useRunnerSelector(AttrSelectors.selectAllInfo)

  if (!showMaximums) {
    return <AttributeValueRow values={attrs} attrKeys={attrKeys} />
  }

  const attributes = attrKeys
    .map((k) => ({ key: k, value: attrs[k] }))
    .filter((it) => it.value !== 0)

  if (attributes.length === 0) return null

  return (
    <Stack direction="row" sx={{ gap: 0.5 }}>
      {attributes.map(({ key, value }) => {
        const min = attrMin(attrInfos, key)
        const natMax = attrNaturalMax(attrInfos, key)
        const augMax = attrAugmentedMax(attrInfos, key)

        return (
          <Stack key={key} sx={{ flexGrow: 1, alignItems: "center", gap: 0 }}>
            <Label label={AttributeLabels[key]} variant="text" />
            <Typography>
              {value ?? min} / {natMax} {(augMax) >= 1 && <>({augMax})</>}
            </Typography>
          </Stack>
        )
      })}
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
