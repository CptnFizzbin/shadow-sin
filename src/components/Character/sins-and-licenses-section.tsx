import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { getSinAvailability } from "#/components/CharacterBuilder/Sections/Gear/Licenses/sin-utils.ts"
import { useGearByType } from "#/components/Gear/use-gear-api.ts"
import { RatingChip } from "#/components/UI/rating-chip.tsx"
import type { LicenseData } from "#/lib/system/gear/license-data.ts"
import type { SinData } from "#/lib/system/gear/sin-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

interface SinCardProps {
  sin: SinData
  licenses: LicenseData[]
}

const SinCard: FC<SinCardProps> = ({ sin, licenses }) => {
  const sinAvail = getSinAvailability(sin.rating)
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
          {sinLicenses.map((license) => (
            <Stack key={license.id} direction="row" alignItems="center">
              <Typography sx={{ flexGrow: 1 }}>
                {license.name}
              </Typography>
              <RatingChip rating={license.rating} />
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  )
}

export const SinsAndLicensesSection: FC = () => {
  const sins = useGearByType<SinData>(GearType.sin)
  const licenses = useGearByType<LicenseData>(GearType.license)

  if (sins.length === 0) return null

  return (
    <Stack gap={1}>
      <Typography variant="subtitle2">SINs & Licenses</Typography>
      {sins.map((sin) => (
        <SinCard key={sin.id} sin={sin} licenses={licenses} />
      ))}
    </Stack>
  )
}
