import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useRouter } from "@tanstack/react-router"
import { useState } from "react"

import { Artemis } from "#/character/fixtures/artemis.ts"
import { Hexen } from "#/character/fixtures/hexen.ts"
import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"

function ShadowSinDevtoolsPanel() {
  const router = useRouter()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)

  async function clearAllCharacters() {
    const characters = await localCharacterManager.listCharacters()
    await Promise.all(
      Object.keys(characters).map((characterId) =>
        localCharacterManager.deleteCharacter(characterId),
      ),
    )
    await router.invalidate({ sync: true })
    setStatusMessage(`Cleared ${Object.keys(characters).length} character(s).`)
  }

  async function reloadFixtureCharacters() {
    const fixtureCharacters = [Artemis, Hexen]
    for (const character of fixtureCharacters) {
      await localCharacterManager.forceSave(character)
    }
    await router.invalidate({ sync: true })
    setStatusMessage(`Reloaded ${fixtureCharacters.length} fixture character(s).`)
  }

  return (
    <Stack sx={{ padding: 2 }}>
      <Typography variant="h6">ShadowSIN</Typography>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button variant="outlined" color="error" onClick={clearAllCharacters}>
          Clear All Characters
        </Button>
        <Button variant="outlined" onClick={reloadFixtureCharacters}>
          Reload Fixture Characters
        </Button>
      </Stack>
      {statusMessage && (
        <Typography variant="body2" color="text.secondary">
          {statusMessage}
        </Typography>
      )}
    </Stack>
  )
}

export const ShadowSinDevtools = {
  id: "shadow-sin",
  name: "ShadowSIN",
  render: <ShadowSinDevtoolsPanel />,
}
