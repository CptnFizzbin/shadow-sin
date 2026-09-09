import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { AttrSelectors } from "#/stores/runner/attributes/attributesSlice.selectors.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"

import { AttrDecrementButton } from "./attrDecrementButton.tsx"
import { AttrIncrementButton } from "./attrIncrementButton.tsx"

interface AttributeRowProps {
  attr: AttributeKey
}

export const AttributeRow: FC<AttributeRowProps> = ({ attr }) => {
  const { computed } = useRunnerSelector(AttrSelectors.selectInfo, { key: attr })

  return (
    computed ? <ComputedAttributeRow attr={attr} /> : <EditableAttributeRow attr={attr} />
  )
}

const ComputedAttributeRow: FC<{ attr: AttributeKey }> = ({ attr }) => {
  const value = useRunnerSelector(AttrSelectors.selectValue, { key: attr })

  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <Grid container columns={2} sx={{ flexGrow: 1 }}>
        <Grid size={1}>
          <Typography sx={{ textAlign: "center" }}>
            {AttributeLabels[attr]}:
          </Typography>
        </Grid>

        <Grid size={1}>
          <Typography sx={{ textAlign: "center", flexGrow: 1 }}>
            {value}
          </Typography>
        </Grid>
      </Grid>
    </Stack>
  )
}

const EditableAttributeRow: FC<{ attr: AttributeKey }> = ({ attr }) => {
  const attrInfo = useRunnerSelector(AttrSelectors.selectInfo, { key: attr })
  const attrValue = useRunnerSelector(AttrSelectors.selectBase, { key: attr })

  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <AttrDecrementButton attr={attr} />

      <Grid container columns={2} sx={{ flexGrow: 1 }}>
        <Grid size={1}>
          <Typography sx={{ textAlign: "center" }}>
            {AttributeLabels[attr]}:
          </Typography>
        </Grid>

        <Grid size={1}>
          <Typography sx={{ textAlign: "center", flexGrow: 1 }}>
            {attrValue} / {attrInfo.max}
          </Typography>
        </Grid>
      </Grid>

      <AttrIncrementButton attr={attr} />
    </Stack>
  )
}
