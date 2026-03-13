import Stack from "@mui/material/Stack"
import Typography from "@mui/material/Typography"
import { createFileRoute } from "@tanstack/react-router"
import { artemis } from "#/data/characters/artemis.ts"
import CharacterRosterList from "#/components/Character/CharacterRosterList.tsx"

const characters = [artemis]

export const Route = createFileRoute("/")({
  component: IndexRoute
})

function IndexRoute () {
  return (
    <Stack spacing={2}>
      <Typography variant="h4">Characters</Typography>
      <CharacterRosterList characters={characters} />
    </Stack>
  )
}
