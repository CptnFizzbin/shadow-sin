import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import CharacterRosterList from "#/components/Character/CharacterRosterList.tsx"
import { Header } from "#/components/UI/Header.tsx"
import { Artemis } from "#/lib/fixture/character/artemis.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/LocalCharacterManager.ts"

export const Route = createFileRoute("/")({
  loader: () => {
    return localCharacterManager.ensureCharacters([Artemis])
  },
  component: IndexRoute,
})

function IndexRoute() {
  const navigate = Route.useNavigate()
  const characters = Route.useLoaderData()

  return (
    <Stack spacing={1}>
      <Header />
      <Button
        variant="outlined"
        onClick={() => {
          navigate({ to: "/new" })
        }}
      >
        Create New
      </Button>
      <CharacterRosterList characters={characters} />
    </Stack>
  )
}
