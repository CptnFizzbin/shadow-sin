import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { SinsAndLicensesSection as SharedSinsAndLicensesSection } from "#/components/Licenses/sins-and-licenses-section.tsx"
import { Nuyen } from "#/components/UI/nuyen.tsx"

export const SinsAndLicensesSection: FC = () => {
  return (
    <SharedSinsAndLicensesSection
      slots={{
        sinTrailingContent: (sin) => (
          <Typography variant="body2" color="text.secondary">
            <Nuyen amount={sin.cost} />
          </Typography>
        ),
        licenseTrailingContent: (license) => (
          <Typography variant="body2" color="text.secondary">
            <Nuyen amount={license.cost} />
          </Typography>
        ),
      }}
    />
  )
}
