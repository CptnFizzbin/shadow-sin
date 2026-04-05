import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { useGearByType } from "#/components/gear/useGearApi.ts"
import { SinCard } from "#/components/licenses/sinCard.tsx"
import type { LicenseData } from "#/lib/system/gear/licenseData.ts"
import type { SinData } from "#/lib/system/gear/sinData.ts"
import { GearType } from "#/lib/system/gearType.ts"

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
