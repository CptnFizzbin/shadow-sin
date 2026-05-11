import Grid from "@mui/material/Grid"
import type { FC } from "react"

import { Label } from "#/components/ui/text/label"

export const AttributeImprovment: FC = () => {
  return (
    <Grid container columns={4}>
      <Grid size={4}>
        <Label>Attributes</Label>
      </Grid>
    </Grid>
  )
}
