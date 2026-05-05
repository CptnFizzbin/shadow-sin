import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { useRouter } from "@tanstack/react-router"
import { useState } from "react"

import { useCharacterManager } from "#/character/characterManagerContext.tsx"
import { Artemis } from "#/character/fixtures/artemis.ts"
import { Hexen } from "#/character/fixtures/hexen.ts"

function ShadowSinDevtoolsPanel() {
  const router = useRouter()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const characterManager = useCharacterManager()

  async function clearAllCharacters() {
    const characters = await characterManager.listCharacters()
    await Promise.all(
      characters.map((savedChar) =>
        characterManager.deleteCharacter(savedChar.id),
      ),
    )
    await router.invalidate({ sync: true })
    setStatusMessage(`Cleared ${characters.length} character(s).`)
  }

  async function reloadFixtureCharacters() {
    const fixtureCharacters = [Artemis, Hexen]
    for (const character of fixtureCharacters) {
      await characterManager.saveCharacter(character)
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
