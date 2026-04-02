import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Box from "@mui/material/Box"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { createFileRoute, Outlet, useNavigate, useRouter } from "@tanstack/react-router"
import { useMemo } from "react"

import { CharacterSheetProvider } from "#/components/Character/CharacterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/Character/CharacterSheetStore.ts"
import { CharacterSheetNav } from "#/components/Character/Nav/CharacterSheetNav.tsx"
import { useCharacterNav } from "#/components/Character/Nav/UseCharacterNav.ts"
import { downloadTextFile } from "#/components/CharacterBuilder/ExportUtils.ts"
import { usePersistStore } from "#/components/CharacterBuilder/StorePersister.ts"
import { SwipeSurface } from "#/components/UI/SwipeSurface.tsx"
import { Artemis } from "#/lib/fixture/character/artemis.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/LocalCharacterManager.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const Route = createFileRoute("/$characterId")({
  component: CharacterRoute,
  errorComponent: CharacterErrorRoute,
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

function CharacterErrorRoute() {
  const { characterId } = Route.useParams()
  const navigate = useNavigate()
  const router = useRouter()

  const handleExport = async () => {
    const storedCharacter = await localCharacterManager.getCharacter(characterId).catch(() => null)
    const rawData = storedCharacter ?? { characterId }
    const jsonContent = JSON.stringify(rawData, null, 2)
    downloadTextFile(jsonContent, `invalid-character-${characterId}.json`, "application/json")
  }

  const handleDelete = async () => {
    await localCharacterManager.deleteCharacter(characterId)
    await router.invalidate()
    await navigate({ to: "/" })
  }

  return (
    <Stack gap={2} padding={2}>
      <Alert severity="error">
        <AlertTitle>Failed to load character</AlertTitle>
        This character sheet could not be loaded. It may be corrupted or from an incompatible version.
      </Alert>

      <Stack direction="row" gap={1}>
        <Button variant="outlined" onClick={handleExport}>
          Export raw data as JSON
        </Button>
        <Button variant="outlined" color="error" onClick={handleDelete}>
          Delete character
        </Button>
        <Button variant="text" onClick={() => navigate({ to: "/" })}>
          Back to roster
        </Button>
      </Stack>
    </Stack>
  )
}
