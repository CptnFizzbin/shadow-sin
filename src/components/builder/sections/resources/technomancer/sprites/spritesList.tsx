import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useState } from "react"

import { useSpritesBuildPoints } from "#/components/builder/buildPoints/hooks/useSpritesBuildPoints.ts"
import { SpriteDialog } from "#/components/character/technomancer/dialogs/spriteDialog.tsx"
import {
  SpritesListItem,
} from "#/components/builder/sections/resources/technomancer/sprites/spritesListItem.tsx"
import { useAttr } from "#/components/character/characterUtils.ts"
import { useMaxSpritesRegistered } from "#/components/character/technomancer/spritesHooks.ts"
import { selectAllSprites } from "#/components/character/technomancer/spritesSelectors.ts"
import { useSpritesStore } from "#/components/character/technomancer/useSpritesStore.ts"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { getProgress } from "#/lib/progressUtils.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

type SpriteDialogState =
  | null
  | { mode: "create", open: boolean }
  | { mode: "edit", sprite: SpriteData, open: boolean }

export const SpritesList: FC = () => {
  const resonance = useAttr(AttributeKey.resonance)
  const maxSpritesRegistered = useMaxSpritesRegistered()
  const spritesStore = useSpritesStore()
  const sprites = useStore(spritesStore, selectAllSprites)
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
    <Stack sx={{ gap: 1 }}>
      <Label label="Sprites" variant="outlined" />

      <Stack sx={{ gap: 0.5 }}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center" }}
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
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          No sprites added
        </Typography>
      )}

      {sprites.length > 0 && (
        <Stack sx={{ gap: 0.5 }}>
          {sprites.map((sprite) => (
            <SpritesListItem
              key={sprite.id}
              sprite={sprite}
              resonanceValue={resonance}
              onEdit={() =>
                setSpriteDialog({ mode: "edit", sprite, open: true })}
              onDelete={() => spritesStore.remove(sprite.id)}
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
            spritesStore.save(sprite)
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
            spritesStore.save(sprite)
            closeDialog()
          }}
          onClose={closeDialog}
          onClosed={clearDialog}
        />
      )}
    </Stack>
  )
}
