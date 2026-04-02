import FormControl from "@mui/material/FormControl"
import IconButton from "@mui/material/IconButton"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select"
import Stack from "@mui/material/Stack"
import MuiTextField from "@mui/material/TextField"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { getDefaultTarget, getTargetOptions } from "#/components/GameEffects/GameEffectUtils.tsx"
import type { GameEffectData } from "#/lib/system/GameEffects/GameEffectData.ts"
import { GameEffectTypeOptions } from "#/lib/system/GameEffects/GameEffectTypeOptions.ts"

interface GameEffectRowProps {
  effect: GameEffectData
  onChange: (updated: GameEffectData) => void
  onRemove: () => void
}

export const GameEffectRow: FC<GameEffectRowProps> = ({ effect, onChange, onRemove }) => {
  const targetOptions = getTargetOptions(effect.type)

  return (
    <Stack direction="row" gap={1} alignItems="flex-start" flexWrap="wrap">
      <FormControl size="small" sx={{ flex: "2 1 120px" }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={effect.type}
          label="Type"
          onChange={(e) => {
            const newType = e.target.value
            onChange({ ...effect, type: newType, target: getDefaultTarget(newType) })
          }}
        >
          {GameEffectTypeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {targetOptions !== null && (
        <FormControl size="small" sx={{ flex: "2 1 120px" }}>
          <InputLabel>Target</InputLabel>
          <Select
            value={effect.target ?? ""}
            label="Target"
            onChange={(e) => onChange({ ...effect, target: e.target.value })}
          >
            {targetOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <MuiTextField
        label="Value"
        type="number"
        size="small"
        sx={{ flex: "1 1 60px", minWidth: 60 }}
        value={effect.value}
        onChange={(e) => onChange({ ...effect, value: Number(e.target.value) })}
        slotProps={{ htmlInput: { step: 1 } }}
      />

      <IconButton size="small" onClick={onRemove} sx={{ mt: 0.5 }}>
        <RiDeleteBin6Line size={16} />
      </IconButton>
    </Stack>
  )
}
