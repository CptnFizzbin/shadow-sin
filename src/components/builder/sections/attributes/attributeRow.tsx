import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useAttr, useAttrInfo } from "#/components/runner/runnerUtils.ts"
import type { AttributeKey } from "#/system/attributeKey.ts"
import { AttributeLabels } from "#/system/attributeKey.ts"

import { AttrDecrementButton } from "./attrDecrementButton.tsx"
import { AttrIncrementButton } from "./attrIncrementButton.tsx"

interface AttributeRowProps {
  attr: AttributeKey
}

export const AttributeRow: FC<AttributeRowProps> = (props) => {
  const attrLabel = AttributeLabels[props.attr]
  const attrInfo = useAttrInfo(props.attr)
  const attrValue = useAttr(props.attr)

  return (
    <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
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
