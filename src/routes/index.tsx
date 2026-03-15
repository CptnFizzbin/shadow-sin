import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"
import { artemis } from "#/data/characters/artemis.ts"
import CharacterRosterList from "#/components/Character/CharacterRosterList.tsx"
import { Header } from "#/components/UI/Header.tsx"

const characters = [artemis]

export const Route = createFileRoute("/")({
  component: IndexRoute
})

function IndexRoute () {
  return (
    <Stack spacing={2}>
      <Header />

      <CharacterRosterList characters={characters} />
    </Stack>
  )
}
