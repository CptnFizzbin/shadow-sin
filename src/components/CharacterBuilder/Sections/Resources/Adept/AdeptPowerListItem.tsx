import Chip from "@mui/material/Chip"
import Paper from "@mui/material/Paper"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import type { FC } from "react"

import { getAdeptPowerBpCost } from "#/components/CharacterBuilder/Sections/Resources/Adept/AdeptPowersUtils.ts"
import { PowerPoints } from "#/components/UI/PowerPoints.tsx"
import type { AdeptPowerData } from "#/lib/system/magic/adeptPowerData.ts"

interface AdeptPowerListItemProps {
  power: AdeptPowerData
  onEdit?: () => void
}

export const AdeptPowerListItem: FC<AdeptPowerListItemProps> = ({
  power,
  onEdit,
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
      onClick={onEdit}
    >
      <Stack direction="row" gap={1} alignItems="center">
        <Typography flexGrow={1}>{power.name}</Typography>
        <Chip
          label={`Rating: ${power.rating}`}
          variant="outlined"
          size="small"
        />
        <PowerPoints value={getAdeptPowerBpCost(power)} variant="body2" />
      </Stack>
    </Paper>
  )
}
