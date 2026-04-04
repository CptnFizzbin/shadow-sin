import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { RatingChip } from "#/components/UI/rating-chip.tsx"
import type { LicenseData } from "#/lib/system/gear/license-data.ts"

interface LicenseCardProps {
  license: LicenseData
}

export const LicenseCard: FC<LicenseCardProps> = ({
  license,
}) => {
  return (
    <Stack direction="row" alignItems="center" paddingRight={1}>
      <Typography sx={{ flexGrow: 1 }}>
        {license.name}
      </Typography>

      <RatingChip rating={license.rating} />
    </Stack>
  )
}
