import { Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import { createFileRoute } from "@tanstack/react-router";
import CharacterRosterList from "#/components/Character/CharacterRosterList.tsx";
import { Header } from "#/components/UI/Header.tsx";
import { artemis } from "#/data/characters/artemis.ts";

const characters = [artemis];

export const Route = createFileRoute("/")({
	component: IndexRoute,
});

function IndexRoute() {
	const navigate = Route.useNavigate();

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
