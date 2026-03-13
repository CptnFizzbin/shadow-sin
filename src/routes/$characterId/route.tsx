import Stack from "@mui/material/Stack";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { createStore } from "@tanstack/store";
import { CharacterStoreProvider } from "#/components/Character/CharacterStoreProvider.tsx";
import Header from "#/components/UI/Header.tsx";
import { artemis } from "#/data/characters/artemis.ts";
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts";

export const Route = createFileRoute("/$characterId")({
	component: CharacterRoute,
	loader: (): PlayerCharacterData => {
		// In a real application, you would fetch the character data based on the characterId param.
		// For this example, we'll just return the artemis character data.
		return artemis;
	},
});

function CharacterRoute() {
	const character = Route.useLoaderData();
	const store = createStore(character);

	return (
		<CharacterStoreProvider store={store}>
			<Stack spacing={2}>
				<Header />

				<Outlet />
			</Stack>
		</CharacterStoreProvider>
	);
}
