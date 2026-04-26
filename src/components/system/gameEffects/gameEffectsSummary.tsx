import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import Divider from "@mui/material/Divider"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiFlashlightLine } from "@remixicon/react"
import type { FC } from "react"

import { useGameEffectsDialog } from "#/components/system/gameEffects/gameEffectsDialog.tsx"
import type { GameEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { GameEffectTypeOptions } from "#/system/gameEffects/gameEffectTypeOptions.ts"

function getEffectLabel(effect: GameEffectData): string {
  const typeOption = GameEffectTypeOptions.find((o) => o.value === effect.type)
  const typeLabel = typeOption?.label ?? effect.type

  const targetLabel = effect.target
    ? typeOption?.targets?.find((t) => t.value === effect.target)?.label ?? effect.target
    : undefined

  const sign = effect.value >= 0 ? "+" : ""

  const parts = [typeLabel, targetLabel, effect.subTarget].filter(Boolean)
  return `${parts.join(" → ")} ${sign}${effect.value}`
}

interface GameEffectsSummaryProps {
  effects: GameEffectData[]
  onChange: (effects: GameEffectData[]) => void
}

export const GameEffectsSummary: FC<GameEffectsSummaryProps> = ({ effects, onChange }) => {
  const gameEffectsDialog = useGameEffectsDialog()

  const handleOpenDialog = async () => {
    const result = await gameEffectsDialog.open({ initialEffects: effects }).result()

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
