import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useRunnerAttrInfo } from "#/components/runner/runnerUtils.ts"
import { useEntitySelector } from "#/lib/contexts/entity/entityProvider.tsx"
import { AttrSelectors } from "#/lib/stores/runner/attributes/attributesSlice.selectors.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"

import { AttrDecrementButton } from "./attrDecrementButton.tsx"
import { AttrIncrementButton } from "./attrIncrementButton.tsx"

interface AttributeRowProps {
  attr: AttributeKey
}

export const AttributeRow: FC<AttributeRowProps> = (props) => {
  const attrLabel = AttributeLabels[props.attr]
  const attrInfo = useRunnerAttrInfo(props.attr)
  const attrValue = useEntitySelector(AttrSelectors.selectValue, { key: props.attr })

  return (
    <Stack direction="row" sx={{ alignItems: "center" }}>
      <AttrDecrementButton {...props} />

      <Grid container columns={2} sx={{ flexGrow: 1 }}>
        <Grid size={1}>
          <Typography sx={{ textAlign: "center" }}>
            {attrLabel}:
          </Typography>
        </Grid>

        <Grid size={1}>
          <Typography sx={{ textAlign: "center", flexGrow: 1 }}>
            {attrValue} / {attrInfo.max}
          </Typography>
        </Grid>
      </Grid>

      <AttrIncrementButton {...props} />
    </Stack>
  )
}
