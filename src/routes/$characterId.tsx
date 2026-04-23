import Box from "@mui/material/Box"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

import { CharacterErrorRoute } from "#/components/character/characterErrorRoute.tsx"
import { CharacterSheetNav } from "#/components/character/nav/characterSheetNav.tsx"
import { useCharacterNav } from "#/components/character/nav/useCharacterNav.ts"
import { QuickAccessPanel } from "#/components/character/quickPanel/quickAccessPanel.tsx"
import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

export const Route = createFileRoute("/$characterId")({
  component: CharacterRoute,
  errorComponent: CharacterErrorRoute,
  loader: async ({ params }): Promise<CharacterSheet> => {
    const character = await localCharacterManager.getCharacter(params.characterId)

    if (!character) {
      throw new Error(`Character ${params.characterId} was not found.`)
    }

    return character
  },
})

function CharacterRoute() {
  const character = Route.useLoaderData()
  const store = useMemo(() => new CharacterSheetStore(character), [character])

  useEffect(() => {
    const { unsubscribe } = store.subscribe(async (sheet) => {
      try {
        await localCharacterManager.save(sheet)
      } catch (error) {
        console.error("Failed to save character sheet.", error)
      }
    })

    return () => unsubscribe()
  }, [store])

  return (
    <CharacterSheetProvider store={store}>
      <CharacterSheetContent />
    </CharacterSheetProvider>
  )
}

function CharacterSheetContent() {
  const { nextPage, prevPage } = useCharacterNav()

  return (
    <>
      <CharacterSheetNav />

      <SwipeSurface onSwipeRightToLeft={nextPage} onSwipeLeftToRight={prevPage}>
        <Box sx={{ padding: 1 }}>
          <Outlet />
        </Box>
      </SwipeSurface>

      <Box
        sx={{
          paddingX: 1,
          position: "sticky",
          bottom: 12,
          zIndex: "appBar",
        }}
      >
        <QuickAccessPanel />
      </Box>
    </>
  )
}
