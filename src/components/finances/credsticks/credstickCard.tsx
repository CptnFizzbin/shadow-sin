import Box from "@mui/material/Box"
import Chip from "@mui/material/Chip"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { formatNuyen } from "#/components/ui/nuyen.tsx"
import type { CredstickData } from "#/lib/system/gear/credstickData.ts"
import { CredstickMaxBalance, CredstickTypeLabel } from "#/lib/system/gear/credstickData.ts"

export interface CredstickCardProps {
  credstick: CredstickData
  onClick: (credstick: CredstickData) => void
}

export const CredstickCard: FC<CredstickCardProps> = ({ credstick, onClick }) => {
  const maxBalance = CredstickMaxBalance[credstick.credstickType]
  const fillPercent = maxBalance > 0 ? (credstick.balance / maxBalance) * 100 : 0

  return (
    <Box
      onClick={() => onClick(credstick)}
      sx={{
        "border": "1px solid",
        "borderColor": "divider",
        "borderRadius": 1,
        "padding": 1,
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
    >
      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", gap: 1 }}>
        <Stack sx={{ flex: 1, gap: 0.5, minWidth: 0 }}>
          <Typography
            noWrap
            title={credstick.name || CredstickTypeLabel[credstick.credstickType]}

            sx={{ fontWeight: "medium" }}
          >
            {credstick.name || CredstickTypeLabel[credstick.credstickType]}
          </Typography>
          <Stack direction="row" sx={{ gap: 0.5, alignItems: "center", flexWrap: "wrap" }}>
            <Chip
              label={CredstickTypeLabel[credstick.credstickType]}
              size="small"
              variant="outlined"
            />
            <Typography color="text.secondary">
              {fillPercent.toFixed(0)}% full
            </Typography>
          </Stack>
        </Stack>
        <Typography sx={{ fontWeight: "medium", whiteSpace: "nowrap" }}>
          {formatNuyen(credstick.balance)}
        </Typography>
      </Stack>
    </Box>
  )
}
