import Grid from "@mui/material/Grid"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { DecrementButton } from "#/components/CharacterBuilder/Attributes/AttrDecrementButton.tsx"
import { IncrementButton } from "#/components/CharacterBuilder/Attributes/AttrIncrementButton.tsx"
import type { AttributeRowProps } from "#/components/CharacterBuilder/Attributes/UseAttributeState.ts"
import { useAttributeRow } from "#/components/CharacterBuilder/Attributes/UseAttributeState.ts"

export const AttributeRow: FC<AttributeRowProps> = (props) => {
  const { attribute } = useAttributeRow(props)

  return (
    <Stack direction="row" gap={1} alignItems="center">
      <DecrementButton {...props} />

      <Grid container columns={2} sx={{ flexGrow: 1 }}>
        <Grid size={1}>
          <Typography sx={{ textAlign: "center" }}>
            {attribute.label}:
          </Typography>
        </Grid>

        <Grid size={1}>
          <Typography sx={{ textAlign: "center", flexGrow: 1 }}>
            {attribute.value} / {attribute.max}
          </Typography>
        </Grid>
      </Grid>

      <IncrementButton {...props} />
    </Stack>
  )
}
