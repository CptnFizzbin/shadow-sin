import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiFlashlightLine } from "@remixicon/react"
import type { FC } from "react"

import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { getEffectLabel } from "#/system/gameEffects/gameEffectLabel.ts"

import { useGameEffectsDialog } from "./gameEffectsDialog.tsx"

interface GameEffectsSummaryProps {
  effects: GameEffectData[]
  onChange: (effects: GameEffectData[]) => void
}

export const GameEffectsSummary: FC<GameEffectsSummaryProps> = ({ effects, onChange }) => {
  const gameEffectsDialog = useGameEffectsDialog()

  const handleOpenDialog = async () => {
    const result = await gameEffectsDialog.open({ initialEffects: effects })

    if (result) {
      onChange(result)
    }
  }

  return (
    <Stack sx={{ gap: 1 }}>
      <Divider />

      <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="subtitle2">Effects</Typography>
        <Button
          size="small"
          startIcon={<RiFlashlightLine size={14} />}
          onClick={handleOpenDialog}
        >
          {effects.length > 0 ? "Edit Effects" : "Add Effects"}
        </Button>
      </Stack>

      {effects.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          {effects.map((effect, index) => (
            <Chip
              key={`${effect.type}-${effect.target ?? "none"}-${index}`}
              label={getEffectLabel(effect)}
              size="small"
              variant="outlined"
              sx={{ "height": "auto", "& .MuiChip-label": { whiteSpace: "normal" } }}
            />
          ))}
        </Stack>
      )}
    </Stack>
  )
}
