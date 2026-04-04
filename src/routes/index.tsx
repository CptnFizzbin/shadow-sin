import { Button } from "@mui/material"
import Stack from "@mui/material/Stack"
import { createFileRoute } from "@tanstack/react-router"

import CharacterRosterList from "#/components/Character/character-roster-list.tsx"
import { Artemis } from "#/lib/fixture/character/artemis.ts"
import { Hexen } from "#/lib/fixture/character/hexen.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/local-character-manager.ts"

export const Route = createFileRoute("/")({
  loader: () => {
    return localCharacterManager.ensureCharacters([Artemis, Hexen])
  },
  component: IndexRoute,
})

function IndexRoute() {
  const navigate = Route.useNavigate()
  const { characters, errors } = Route.useLoaderData()

  return (
    <Stack gap={1} padding={1}>
      <Button
        variant="outlined"
        onClick={() => {
          navigate({ to: "/new" })
        }}
      >
        Create New
      </Button>
      <CharacterRosterList characters={characters} errors={errors} />
    </Stack>
  )
}
