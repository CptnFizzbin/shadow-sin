import Button from "@mui/material/Button"
import Stack from "@mui/material/Stack"
import { createFileRoute, useRouter } from "@tanstack/react-router"

import { Artemis } from "#/character/fixtures/artemis.ts"
import { Hexen } from "#/character/fixtures/hexen.ts"
import CharacterRosterList from "#/components/character/characterRosterList.tsx"
import { ImportCharacterButton } from "#/components/character/exportImport/importCharacterButton.tsx"
import { localCharacterManager } from "#/lib/storage/localStorage/localCharacterManager.ts"

export const Route = createFileRoute("/")({
  loader: () => {
    return localCharacterManager.ensureCharacters([Artemis, Hexen])
  },
  component: IndexRoute,
})

function IndexRoute() {
  const navigate = Route.useNavigate()
  const router = useRouter()
  const { characters, errors } = Route.useLoaderData()

  return (
    <Stack sx={{ gap: 1, padding: 1 }}>
      <Stack direction="row" sx={{ gap: 1 }}>
        <Button
          variant="outlined"
          onClick={() => {
            navigate({ to: "/new" })
          }}
        >
          Create New
        </Button>
        <ImportCharacterButton onImported={() => router.invalidate({ sync: true })} />
      </Stack>
      <CharacterRosterList characters={characters} errors={errors} />
    </Stack>
  )
}
