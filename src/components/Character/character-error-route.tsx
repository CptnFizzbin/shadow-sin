import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useNavigate, useRouter } from "@tanstack/react-router"

import { downloadTextFile } from '#/components/Character/export-utils.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/LocalCharacterManager.ts"

export const CharacterErrorRoute = () => {
  // Derive characterId from the current location as a robust way to get the
  // param without relying on Route.useParams (avoids circular imports).
  const path = typeof window !== "undefined" ? window.location.pathname : ""
  const characterId = path.split("/").filter(Boolean).pop() ?? "unknown"
  const navigate = useNavigate()
  const router = useRouter()

  const handleExport = async () => {
    const raw = await localCharacterManager.getRawCharacter(characterId).catch(() => null)
    const rawData = raw ?? { characterId }
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

export default CharacterErrorRoute
