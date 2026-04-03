import Box from "@mui/material/Box"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { getLicenseAvailability } from "#/components/CharacterBuilder/Sections/Gear/Licenses/Forms/license-utils.ts"
import { getSinAvailability } from "#/components/CharacterBuilder/Sections/Gear/Licenses/sin-utils.ts"
import { AvailabilityChip } from "#/components/Gear/availability-chip.tsx"
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
        <Stack direction="row" alignItems="center" gap={1}>
          <Typography sx={{ flexGrow: 1, fontSize: "0.875rem" }}>
            {sin.name}
          </Typography>
        </Stack>

        <Stack direction="row" gap={1} sx={{ pt: 1 }}>
          <RatingChip rating={sin.rating} />
          <AvailabilityChip availability={sinAvail} />
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
          {sinLicenses.map((license) => {
            const licenseAvail = getLicenseAvailability(license.rating)

            return (
              <Stack
                key={license.id}
                direction="column"
                gap={0}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Typography>{license.name}</Typography>
                <Stack direction="row" gap={1} sx={{ pt: 1 }}>
                  <RatingChip rating={license.rating} />
                  <AvailabilityChip availability={licenseAvail} />
                </Stack>
              </Stack>
            )
          })}
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
