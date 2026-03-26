import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"
import { useState } from "react"

import { useBuilderAttrValue } from "#/components/CharacterBuilder/CharacterBuilderHooks.ts"
import type { SpriteFormState } from "#/components/CharacterBuilder/Resources/AwakenedFormState.ts"
import { SpriteDialog } from "#/components/CharacterBuilder/Resources/Technomancer/Dialogs/SpriteDialog.tsx"
import {
  useMaxSpritesRegistered,
  useSpritesBuildPoints,
} from "#/components/CharacterBuilder/Resources/Technomancer/SpritesHooks.ts"
import { SpritesListItem } from "#/components/CharacterBuilder/Resources/Technomancer/SpritesListItem.tsx"
import { useBuilderSpritesApi } from "#/components/CharacterBuilder/Resources/Technomancer/UseSpritesApi.ts"
import { BuildPoints } from "#/components/UI/BuildPoints.tsx"
import { Label } from "#/components/UI/Text/Label.tsx"
import { getProgress } from "#/lib/ProgressUtils.ts"
import { AttributeKey } from "#/lib/system/attributeKey.ts"

type SpriteDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", sprite: SpriteFormState, open: boolean }

export const SpritesList: FC = () => {
  const resonance = useBuilderAttrValue(AttributeKey.resonance)
  const maxSpritesRegistered = useMaxSpritesRegistered()
  const { sprites, addSprite, updateSprite, removeSprite } =
    useBuilderSpritesApi()
  const spritesBp = useSpritesBuildPoints()

  const [spriteDialog, setSpriteDialog] = useState<SpriteDialogState>(null)

  const closeDialog = () => {
    setSpriteDialog((prev) => prev && { ...prev, open: false })
  }

  const clearDialog = () => {
    setSpriteDialog(null)
  }

  const isAtMax = sprites.length >= maxSpritesRegistered

  return (
    <Stack gap={1}>
      <Label label="Sprites" variant="outlined" />

      <Stack gap={0.5}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography color="text.secondary">
            {sprites.length} / {maxSpritesRegistered} sprites
          </Typography>
          <BuildPoints value={spritesBp.spent} />
        </Stack>

        <LinearProgress
          variant="determinate"
          value={getProgress(sprites.length, maxSpritesRegistered)}
        />
      </Stack>

      {isAtMax && (
        <Alert severity="warning" sx={{ py: 0 }}>
          Maximum sprites reached ({maxSpritesRegistered})
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
            <SpritesListItem
              key={sprite.id}
              sprite={sprite}
              resonanceValue={resonance}
              onEdit={() =>
                setSpriteDialog({ mode: "edit", sprite, open: true })}
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
          onSave={(sprite) => {
            addSprite(sprite)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}

      {spriteDialog?.mode === "edit" && (
        <SpriteDialog
          open={spriteDialog.open}
          sprite={spriteDialog.sprite}
          onSave={(sprite) => {
            updateSprite(sprite)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}
    </Stack>
  )
}
