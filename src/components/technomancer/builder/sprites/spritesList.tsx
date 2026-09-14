import Alert from "@mui/material/Alert"
import Button from "@mui/material/Button"
import LinearProgress from "@mui/material/LinearProgress"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { RiAddLine } from "@remixicon/react"
import type { FC } from "react"

import { useSpriteDialog } from "#/components/technomancer/viewer/dialogs/spriteDialog.tsx"
import { BuildPoints } from "#/components/ui/buildPoints.tsx"
import { Label } from "#/components/ui/text/label.tsx"
import { useSpritesBuildPoints } from "#/hooks/builder/buildPoints/useSpritesBuildPoints.ts"
import { useEntitySelector } from "#/hooks/entity/useEntitySelector.ts"
import { AttrSelectors } from "#/state/runner/attributes/attributes.selector.ts"
import { Actions } from "#/state/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/state/runner/runnerStore.dispatch.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"
import { SpriteSelectors } from "#/state/runner/sprites/sprites.selector.ts"
import { AttributeKey } from "#/system/model/attributes/attributeKey.ts"
import type { SpriteData } from "#/system/model/magic/spriteData.ts"
import { getProgress } from "#/utils/progressUtils.ts"

import { SpritesListItem } from "./spritesListItem.tsx"

export const SpritesList: FC = () => {
  const resonance = useEntitySelector(AttrSelectors.selectValue, { key: AttributeKey.resonance })
  const maxSpritesRegistered = useRunnerSelector(SpriteSelectors.selectMaxRegistered)
  const dispatch = useRunnerStoreDispatch()
  const sprites = useRunnerSelector(SpriteSelectors.selectVisible)
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

      {spriteDialog.outlet}
    </Stack>
  )
}
