import Stack from "@mui/material/Stack"
import { produce } from "immer"
import type { FC } from "react"

import { ItemList } from "#/components/items/card/itemList.tsx"
import { useSpriteDialog } from "#/components/runner/technomancer/dialogs/spriteDialog.tsx"
import { useConfirmDialog } from "#/components/ui/dialog/confirmDialog.tsx"
import { Actions } from "#/lib/stores/runner/runnerStore.actions.ts"
import { useRunnerStoreDispatch } from "#/lib/stores/runner/runnerStore.dispatch.ts"
import { Selectors, useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { SpriteData } from "#/system/magic/spriteData.ts"

import { SpriteDataCard } from "./spriteDataCard.tsx"

export const SpriteList: FC = () => {
  const dispatch = useRunnerStoreDispatch()
  const sprites = useRunnerStoreSelector(Selectors.sprites.selectSprites)
  const spriteDialog = useSpriteDialog()
  const confirmDialog = useConfirmDialog()

  const handleAdd = async () => {
    const saved = await spriteDialog.open()
    if (saved) dispatch(Actions.sprites.saveSprite(saved))
  }

  const handleEdit = async (sprite: SpriteData) => {
    const saved = await spriteDialog.open({ sprite })
    if (saved) dispatch(Actions.sprites.saveSprite(saved))
  }

  const handleRemove = async (sprite: SpriteData) => {
    if (await confirmDialog.confirm({
      title: `Dismiss ${sprite.name}?`,
      body: "Are you sure you want to dismiss this sprite? This action cannot be undone.",
      confirmLabel: "Dismiss",
    })) {
      dispatch(Actions.sprites.removeSprite(sprite.id))
    }
  }

  return (
    <>
      <Stack sx={{ gap: 1 }}>
        <ItemList.AddItemButton onClick={handleAdd}>Compile Sprite</ItemList.AddItemButton>
        {sprites.map((sprite) => (
          <SpriteDataCard
            key={sprite.id}
            sprite={sprite}
            onEdit={() => handleEdit(sprite)}
            onRemove={() => handleRemove(sprite)}
            onDamageChange={(damage) =>
              dispatch(Actions.sprites.updateSprite(produce(sprite, (draft) => { draft.damage = damage })))}
          />
        ))}
      </Stack>

      {spriteDialog.dialog}
      {confirmDialog.dialog}
    </>
  )
}
