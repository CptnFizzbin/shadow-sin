import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType } from "#/components/Gear/use-gear-api.ts"
import type { LicenseData } from "#/lib/system/gear/license-data.ts"
import type { SinData } from "#/lib/system/gear/sin-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

interface SinLicensesProps {
  sin: SinData
  licenses: LicenseData[]
}

const SinLicenses: FC<SinLicensesProps> = ({ sin, licenses }) => {
  const sinLicenses = licenses.filter((license) => license.parentId === sin.id)

  return (
    <Stack
      gap={0.5}
      sx={{
        padding: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Typography variant="body2" sx={{ flexGrow: 1 }}>
          {sin.name}
        </Typography>
        <Chip
          label={sin.rating === "real" ? "Real" : `Rating ${sin.rating}`}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.7rem" }}
        />
      </Stack>

      {sinLicenses.length > 0 && (
        <Stack
          gap={0.5}
          sx={{
            pl: 1,
            borderLeft: "3px solid",
            borderColor: "divider",
          }}
        >
          {sinLicenses.map((license) => (
            <Stack key={license.id} direction="row" alignItems="center" gap={1}>
              <Typography variant="caption" sx={{ flexGrow: 1 }}>
                {license.name}
              </Typography>
              <Chip
                label={`Rating ${license.rating}`}
                size="small"
                variant="outlined"
                sx={{ height: 18, fontSize: "0.65rem" }}
              />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
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
        <SinLicenses key={sin.id} sin={sin} licenses={licenses} />
      ))}
    </Stack>
  )
}
