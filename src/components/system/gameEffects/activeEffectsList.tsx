import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Switch from "@mui/material/Switch"
import Typography from "@mui/material/Typography"
import { RiDeleteBin6Line } from "@remixicon/react"
import type { FC } from "react"

import { useCharacterSheetSelector } from "#/components/character/sheet/characterSheet.selectors.ts"
import { useTemporaryEffectsStore } from "#/components/character/temporaryEffects/useTemporaryEffectsStore.ts"
import { useConfirmDialog } from "#/components/dialogs/confirmDialog.tsx"
import type { TemporaryEffectData } from "#/system/gameEffects/gameEffectData.ts"
import { getEffectLabel } from "#/system/gameEffects/gameEffectLabel.ts"

import { selectAllGameEffectsWithSource } from "./useGameEffects.ts"

export const ActiveEffectsList: FC = () => {
  const effectsWithSource = useCharacterSheetSelector(selectAllGameEffectsWithSource)
  const temporaryEffectsStore = useTemporaryEffectsStore()
  const { confirm } = useConfirmDialog()

  const handleToggle = (temporaryEffectId: string) => {
    temporaryEffectsStore.toggle(temporaryEffectId)
  }

  const handleRemove = async (temporaryEffectId: string, label: string) => {
    const confirmed = await confirm({
      title: "Remove Effect",
      body: `Remove "${label}" from temporary effects?`,
      slotProps: { confirmButton: { label: "Remove" } },
    })
    if (confirmed) {
      temporaryEffectsStore.remove(temporaryEffectId)
    }
  }

  if (effectsWithSource.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ textAlign: "center", py: 1 }}>
        No active effects.
      </Typography>
    )
  }

  return (
    <Stack>
      {effectsWithSource.map((entry, index) => {
        const isTemporary = entry.temporaryEffectId !== undefined
        const effectLabel = getEffectLabel(entry.effect)
        const temporaryEffect = isTemporary ? (entry.effect as TemporaryEffectData) : undefined
        const isEnabled = temporaryEffect ? temporaryEffect.enabled : true

        return (
          <Stack
            key={entry.temporaryEffectId ?? `passive-${index}`}
            direction="row"
            sx={{
              alignItems: "center",
              gap: 1,
              py: 0.5,
              opacity: isEnabled ? 1 : 0.5,
            }}
          >
            {isTemporary && (
              <Switch
                size="small"
                checked={isEnabled}
                onChange={() => handleToggle(entry.temporaryEffectId!)}
                slotProps={{ input: { "aria-label": `Toggle ${entry.source}` } }}
              />
            )}

            <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {effectLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {entry.source}
              </Typography>
            </Stack>

            {!isTemporary && (
              <Chip label="Passive" size="small" variant="outlined" sx={{ flexShrink: 0 }} />
            )}

            {isTemporary && (
              <IconButton
                size="small"
                aria-label={`Remove ${entry.source}`}
                onClick={() => handleRemove(entry.temporaryEffectId!, entry.source)}
              >
                <RiDeleteBin6Line size={16} />
              </IconButton>
            )}
          </Stack>
        )
      })}
    </Stack>
  )
}
