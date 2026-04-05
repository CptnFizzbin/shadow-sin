import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { LicenseCard } from "#/components/licenses/licenseCard.tsx"
import { RatingChip } from "#/components/ui/ratingChip.tsx"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"

interface SinCardProps {
  sin: SinData
  licenses: LicenseData[]
}

export const SinCard: FC<SinCardProps> = ({ sin, licenses }) => {
  const sinLicenses = licenses.filter((license) => license.parentId === sin.id)

  return (
    <Box>
      <Stack
        direction="column"
        sx={{
          padding: 1,
          borderRadius: 1,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center">
          <Typography sx={{ flexGrow: 1 }}>
            {sin.name}
          </Typography>
          <RatingChip rating={sin.rating} />
        </Stack>
      </Stack>

      {sinLicenses.length > 0 && (
        <Stack
          gap={1}
          sx={{
            paddingTop: 1,
            paddingLeft: 1,
            paddingBottom: 1,
            borderLeft: "8px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          {sinLicenses.map((license) => <LicenseCard key={license.id} license={license} />)}
        </Stack>
      )}
    </Box>
  )
}
