import Alert from "@mui/material/Alert"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Chip from "@mui/material/Chip"
import IconButton from "@mui/material/IconButton"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine, RiDeleteBin6Line } from "@remixicon/react"
import type { Dispatch, FC, SetStateAction } from "react"
import { useState } from "react"

import { SpriteDialog } from "#/components/Character/Form/Awakened/Technomancer/Dialogs/SpriteDialog.tsx"
import type { SpriteFormState } from "#/components/Character/Form/Awakened/Technomancer/TechnomancerFormState.ts"
import { getSpriteTasksBp } from "#/components/Character/Form/Awakened/Technomancer/TechnomancerRequirements.ts"
import { useTechnomancerFormGroup } from "#/components/Character/Form/Awakened/Technomancer/UseTechnomancerFormGroup.ts"
import { Label } from "#/components/UI/Text/Label.tsx"

type SpriteDialogState =
  | null
  | { mode: "create"; open: boolean }
  | { mode: "edit"; sprite: SpriteFormState; open: boolean }

export const SpritesFormGroup: FC = () => {
  const {
    sprites,
    resonanceValue,
    compilingRating,
    maxSprites,
    totalSpritesBp,
    addSprite,
    updateSprite,
    removeSprite,
  } = useTechnomancerFormGroup()

  const [spriteDialog, setSpriteDialog] = useState<SpriteDialogState>(null)

  const closeDialog = <TDialogState,>(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = <TDialogState,>(
    setter: Dispatch<SetStateAction<TDialogState | null>>,
  ) => {
    setter(null)
  }

  const isAtMax = sprites.length >= maxSprites

  return (
    <Stack gap={1}>
      <Label label="Sprites" variant="outlined" />

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="body2" color="secondary.main">
          {totalSpritesBp} BP
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {sprites.length} / {maxSprites} sprites (CHA)
        </Typography>
      </Stack>

      {isAtMax && (
        <Alert severity="warning" sx={{ py: 0 }}>
          Maximum sprites reached ({maxSprites})
        </Alert>
      )}

      {sprites.length === 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1 }}>
          No sprites added
        </Typography>
      )}

      {sprites.length > 0 && (
        <Stack gap={0.5}>
          {sprites.map((sprite) => (
            <SpriteRow
              key={sprite.id}
              sprite={sprite}
              resonanceValue={resonanceValue}
              onEdit={() =>
                setSpriteDialog({ mode: "edit", sprite, open: true })
              }
              onDelete={() => removeSprite(sprite.id)}
            />
          ))}
        </Stack>
      )}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={() => setSpriteDialog({ mode: "create", open: true })}
        disabled={isAtMax}
      >
        Add Sprite
      </Button>

      {spriteDialog?.mode === "create" && (
        <SpriteDialog
          open={spriteDialog.open}
          resonanceValue={resonanceValue}
          maxTasks={compilingRating}
          onSave={(sprite) => {
            addSprite(sprite)
            closeDialog(setSpriteDialog)
          }}
          onClose={() => closeDialog(setSpriteDialog)}
          onClosed={() => clearDialog(setSpriteDialog)}
        />
      )}

      {spriteDialog?.mode === "edit" && (
        <SpriteDialog
          open={spriteDialog.open}
          sprite={spriteDialog.sprite}
          resonanceValue={resonanceValue}
          maxTasks={compilingRating}
          onSave={(sprite) => {
            updateSprite(sprite)
            closeDialog(setSpriteDialog)
          }}
          onDelete={() => {
            removeSprite(spriteDialog.sprite.id)
            clearDialog(setSpriteDialog)
          }}
          onClose={() => closeDialog(setSpriteDialog)}
          onClosed={() => clearDialog(setSpriteDialog)}
        />
      )}
    </Stack>
  )
}

interface SpriteRowProps {
  sprite: SpriteFormState
  resonanceValue: number
  onEdit: () => void
  onDelete: () => void
}

const SpriteRow: FC<SpriteRowProps> = ({
  sprite,
  resonanceValue,
  onEdit,
  onDelete,
}) => {
  const bpCost = getSpriteTasksBp(sprite.tasks)

  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        cursor: "pointer",
        "&:hover": { bgcolor: "action.hover" },
      }}
      onClick={onEdit}
    >
      <Stack direction="row" alignItems="center" gap={1}>
        <Stack sx={{ flexGrow: 1 }}>
          <Typography variant="body2">{sprite.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            Rating {resonanceValue} · {sprite.tasks} task
            {sprite.tasks !== 1 ? "s" : ""}
          </Typography>
        </Stack>

        <Chip
          label={`R${resonanceValue}`}
          size="small"
          variant="outlined"
          sx={{ height: 20, fontSize: "0.75rem" }}
        />

        <Typography
          variant="caption"
          color="secondary.main"
          sx={{ minWidth: 40, textAlign: "right" }}
        >
          {bpCost} BP
        </Typography>

        <IconButton
          size="small"
          color="error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete()
          }}
        >
          <RiDeleteBin6Line size={14} />
        </IconButton>
      </Stack>
    </Box>
  )
}
