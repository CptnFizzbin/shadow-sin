import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useSpriteDialog } from "#/components/runner/technomancer/dialogs/spriteDialog.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useAttrValue } from "#/lib/contexts/runner/attributesProvider.tsx"
import { useSpritesBuildPoints } from "#/lib/hooks/builder/buildPoints/useSpritesBuildPoints.ts"
import { useMaxSpritesRegistered, useSprites } from "#/lib/hooks/runner/technomancer/spritesHooks.ts"
import { getProgress } from "#/lib/progressUtils.ts"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { AttributeKey } from "#/system/attributeKey.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

import { SpritesListItem } from "./spritesListItem.tsx"

export const SpritesList: FC = () => {
  const resonance = useAttrValue(AttributeKey.resonance)
  const maxSpritesRegistered = useMaxSpritesRegistered()
  const dispatch = useRunnerStoreDispatch()
  const sprites = useSprites()
  const spritesBp = useSpritesBuildPoints()
  const spriteDialog = useSpriteDialog()

  const isAtMax = sprites.length >= maxSpritesRegistered

  const handleAddSprite = async () => {
    const saved = await spriteDialog.open()
    if (saved) dispatch(Actions.sprites.saveSprite(saved))
  }

  const handleEditSprite = async (sprite: SpriteData) => {
    const saved = await spriteDialog.open({ sprite })
    if (saved) dispatch(Actions.sprites.saveSprite(saved))
  }

  return (
    <Stack>
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
              onEdit={() => handleEditSprite(sprite)}
              onDelete={() => dispatch(Actions.sprites.removeSprite(sprite.id))}
            />
          ))}
        </Stack>
      )}

      <Button
        variant="outlined"
        color="secondary"
        size="small"
        startIcon={<RiAddLine size={14} />}
        onClick={handleAddSprite}
        disabled={isAtMax}
      >
        Add Sprite
      </Button>

      {spriteDialog.dialog}
    </Stack>
  )
}
