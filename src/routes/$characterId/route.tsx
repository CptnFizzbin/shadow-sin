import Box from "@mui/material/Box"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useMemo } from "react"

import { CharacterSheetNav } from "#/components/Character/Nav/character-sheet-nav.tsx"
import { useCharacterNav } from "#/components/Character/Nav/use-character-nav.ts"
import { CharacterSheetProvider } from "#/components/Character/character-sheet-provider.tsx"
import { CharacterSheetStore } from "#/components/Character/character-sheet-store.ts"
import { usePersistStore } from "#/components/CharacterBuilder/store-persister.ts"
import { SwipeSurface } from "#/components/UI/swipe-surface.tsx"
import { Artemis } from "#/lib/fixture/character/artemis.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/local-character-manager.ts"
import type { CharacterSheet } from "#/lib/system/character-sheet.ts"

export const Route = createFileRoute("/$characterId")({
  component: CharacterRoute,
  loader: async ({ params }): Promise<CharacterSheet> => {
    await localCharacterManager.ensureCharacters([Artemis])
    const character = await localCharacterManager.getCharacter(params.characterId)

    if (!character) {
      throw new Error(`Character "${params.characterId}" was not found.`)
    }

    return character
  },
})

function CharacterRoute() {
  const character = Route.useLoaderData()
  const store = useMemo(() => new CharacterSheetStore(character), [character])

  const { nextPage, prevPage } = useCharacterNav()
  usePersistStore(`character:${character.id}`, store)

  return (
    <CharacterSheetProvider store={store}>
      <CharacterSheetNav />

      <SwipeSurface onSwipeRightToLeft={nextPage} onSwipeLeftToRight={prevPage}>
        <Box sx={{ padding: 1 }}>
          <Outlet />
        </Box>
      </SwipeSurface>
    </CharacterSheetProvider>
  )
}
