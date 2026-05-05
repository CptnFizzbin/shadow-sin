import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import ButtonGroup from "@mui/material/ButtonGroup"
import { RiDice6Line } from "@remixicon/react"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useEffect, useMemo } from "react"

import { CharacterManager } from "#/character/characterManager.ts"
import { useCharacterManager } from "#/character/characterManagerContext.tsx"
import { CharacterErrorRoute } from "#/components/character/characterErrorRoute.tsx"
import { CharacterSheetNav } from "#/components/character/nav/characterSheetNav.tsx"
import { useCharacterNav } from "#/components/character/nav/useCharacterNav.ts"
import { QuickAccessButton } from "#/components/character/quickPanel/quickAccessButton.tsx"
import { CharacterSheetProvider } from "#/components/character/sheet/characterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/character/sheet/characterSheetStore.ts"
import { DialogApi } from "#/components/dialogs/api/dialogApi.tsx"
import { DialogApiProvider } from "#/components/dialogs/api/dialogApiProvider.tsx"
import { DiceTrayApi } from "#/components/dice/diceTrayApi.ts"
import { useDiceTray } from "#/components/dice/diceTrayContext.ts"
import { DiceTrayProvider } from "#/components/dice/diceTrayProvider.tsx"
import { SwipeSurface } from "#/components/ui/swipeSurface.tsx"
import { LocalStorageProvider } from "#/lib/storage/providers/localStorageProvider.ts"
import type { CharacterSheet } from "#/system/characterSheet.ts"

// Module-level manager for use in loaders (outside React context)
const loaderManager = new CharacterManager({ local: LocalStorageProvider.getStorage() })

export const Route = createFileRoute("/$characterId")({
  component: CharacterRoute,
  errorComponent: CharacterErrorRoute,
  loader: async ({ params }): Promise<CharacterSheet> => {
    const character = await loaderManager.getCharacter(params.characterId)
    return character
  },
})

function CharacterRoute() {
  const character = Route.useLoaderData()
  const store = useMemo(() => new CharacterSheetStore(character), [character])
  const diceTrayApi = useMemo(() => new DiceTrayApi(), [])
  const characterDialogApi = useMemo(() => new DialogApi(), [])
  const characterManager = useCharacterManager()

  useEffect(() => {
    const { unsubscribe } = store.subscribe(async (sheet) => {
      try {
        await characterManager.save(sheet)
      } catch (error) {
        console.error("Failed to save character sheet.", error)
      }
    })

    return () => unsubscribe()
  }, [store, characterManager])

  return (
    <CharacterSheetProvider store={store}>
      <DiceTrayProvider diceTrayApi={diceTrayApi}>
        <DialogApiProvider dialogApi={characterDialogApi}>
          <CharacterSheetContent />
        </DialogApiProvider>
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
