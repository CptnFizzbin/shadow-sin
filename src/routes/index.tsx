import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { createFileRoute } from "@tanstack/react-router";
import CharacterRosterList from "#/components/Character/CharacterRosterList.tsx";
import { Header } from "#/components/UI/Header.tsx";
import { artemis } from "#/data/characters/artemis.ts";
import { characterManager } from "#/lib/storage/index.ts";

export const Route = createFileRoute("/")({
  loader: async () => {
    return characterManager.ensureCharacters([artemis]);
  },
  component: IndexRoute,
});

function IndexRoute() {
  const navigate = Route.useNavigate();
  const characters = Route.useLoaderData();

  return (
    <Stack spacing={1}>
      <Header />
      <Button
        variant={"outlined"}
        onClick={() =>
          navigate({
            to: "/new",
          })
        }
      >
        Create New
      </Button>
      <CharacterRosterList characters={characters} />
    </Stack>
  );
}
