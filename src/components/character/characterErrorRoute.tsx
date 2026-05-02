import Alert from "@mui/material/Alert"
import AlertTitle from "@mui/material/AlertTitle"
import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { useNavigate, useRouter } from "@tanstack/react-router"

import { useCharacterManager } from "#/character/characterManagerContext.tsx"

import { downloadTextFile } from "./exportImport/exportUtils.ts"

export const CharacterErrorRoute = () => {
  const path = typeof window !== "undefined" ? window.location.pathname : ""
  const characterId = path.split("/").filter(Boolean).pop() ?? "unknown"
  const navigate = useNavigate()
  const router = useRouter()
  const characterManager = useCharacterManager()

  const handleExport = async () => {
    const raw = await characterManager.getRawCharacter(characterId).catch(() => null)
    const rawData = raw ?? { characterId }
    const jsonContent = JSON.stringify(rawData, null, 2)
    downloadTextFile(jsonContent, `invalid-character-${characterId}.json`, "application/json")
  }

  const handleDelete = async () => {
    await characterManager.deleteCharacter(characterId)
    await router.invalidate()
    await navigate({ to: "/" })
  }

  return (
    <Stack sx={{ gap: 2, padding: 2 }}>
      <Alert severity="error">
        <AlertTitle>Failed to load character</AlertTitle>
        This character sheet could not be loaded. It may be corrupted or from an incompatible version.
      </Alert>

      <Stack direction="row" sx={{ gap: 1 }}>
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
