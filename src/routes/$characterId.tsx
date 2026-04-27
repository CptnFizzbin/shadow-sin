import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import { RiDice6Line } from "@remixicon/react"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

import { CharacterErrorRoute } from "#/components/character/characterErrorRoute.tsx"
import { CharacterSheetNav } from "#/components/character/nav/characterSheetNav.tsx"
import { useCharacterNav } from "#/components/character/nav/useCharacterNav.ts"
import { QuickAccessButton } from "#/components/character/quickPanel/quickAccessButton.tsx"
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
  // Re-create the dice tray API per character so its in-flight roller state
  // doesn't leak across characters when this route remains mounted.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const diceTrayApi = useMemo(() => new DiceTrayApi(), [store])

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
        <ButtonGroup variant="contained" color="secondary" fullWidth sx={{ borderRadius: 2 }}>
          <QuickAccessButton />

          <Button
            startIcon={<RiDice6Line size={18} />}
            onClick={() => diceTray.setDice(1)}
            aria-label="Open dice tray"
          >
            Dice Tray
          </Button>
        </ButtonGroup>
      </Box>
    </>
  )
}
