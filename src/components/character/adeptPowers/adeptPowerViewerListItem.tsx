import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { getAdeptPowerBpCost } from "./adeptPowersUtils.ts"
import { PowerPoints } from "#/components/ui/powerPoints.tsx"
import type { AdeptPowerData } from "#/system/powers/adeptPowerData.ts"

interface AdeptPowerViewerListItemProps {
  power: AdeptPowerData
  onClick?: () => void
}

export const AdeptPowerViewerListItem: FC<AdeptPowerViewerListItemProps> = ({
  power,
  onClick,
}) => {
  return (
    <Paper
      sx={{
        "padding": 1,
        "border": "1px solid",
        "borderColor": "divider",
        "cursor": "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onClick}
    >
      <Stack direction="row" sx={{ gap: 1, alignItems: "center" }}>
        <Typography sx={{ flexGrow: 1 }}>{power.name}</Typography>
        <Chip
          label={`Rating: ${power.rating}`}
          variant="outlined"
          size="small"
        />
        <PowerPoints value={getAdeptPowerBpCost(power)} />
      </Stack>
    </Paper>
  )
}
