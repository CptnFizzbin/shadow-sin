import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { RiDiceLine } from "@remixicon/react"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

import { CharacterErrorRoute } from "#/components/character/characterErrorRoute.tsx"
import { CharacterSheetNav } from "#/components/character/nav/characterSheetNav.tsx"
import { useCharacterNav } from "#/components/character/nav/useCharacterNav.ts"
import { QuickAccessPanel } from "#/components/character/quickPanel/quickAccessPanel.tsx"
import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { DiceTrayProvider, useDiceTray } from "#/components/dice/diceTrayProvider.tsx"
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
  // eslint-disable-next-line react-hooks/exhaustive-deps -- character.id keys the memo so state resets on character switch
  const diceTrayApi = useMemo(() => new DiceTrayApi(), [character.id])

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

  useEffect(() => {
    return () => diceTrayApi.destroy()
  }, [diceTrayApi])

  return (
    <CharacterSheetProvider store={store}>
      <DiceTrayProvider diceTrayApi={diceTrayApi}>
        <CharacterSheetContent />
      </DiceTrayProvider>
    </CharacterSheetProvider>
  )
}

function CharacterSheetContent() {
  const { nextPage, prevPage } = useCharacterNav()
  const diceTray = useDiceTray()

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
        <Stack direction="row" sx={{ gap: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => diceTray.setDice(1)}
            sx={{ borderRadius: 2, minWidth: 0, px: 1.5 }}
            aria-label="Open dice tray"
          >
            <RiDiceLine size={20} />
          </Button>
          <Box sx={{ flex: 1 }}>
            <QuickAccessPanel />
          </Box>
        </Stack>
      </Box>
    </>
  )
}
