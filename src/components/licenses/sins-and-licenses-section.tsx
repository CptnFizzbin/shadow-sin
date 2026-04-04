import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType } from "#/components/Gear/use-gear-api.ts"
import { SinCard } from "#/components/licenses/sin-card.tsx"
import type { LicenseData } from "#/lib/system/gear/license-data.ts"
import type { SinData } from "#/lib/system/gear/sin-data.ts"
import { GearType } from "#/lib/system/gear-type.ts"

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
