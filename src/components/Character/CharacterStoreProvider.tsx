import { useStore } from "@tanstack/react-store";
import type { Store } from "@tanstack/store";
import {
	createContext,
	type FC,
	type PropsWithChildren,
	useContext,
} from "react";
import type { PlayerCharacterData } from "#/lib/system/types/playerCharacterData.ts";

export const CharacterStoreContext =
	createContext<Store<PlayerCharacterData> | null>(null);

export interface CharacterStoreProviderProps extends PropsWithChildren {
	store: Store<PlayerCharacterData>;
}

export const CharacterStoreProvider: FC<CharacterStoreProviderProps> = ({
	store,
	children,
}) => (
	<CharacterStoreContext.Provider value={store}>
		{children}
	</CharacterStoreContext.Provider>
);

type CharacterDataSelector<TData> = (state: PlayerCharacterData) => TData;

export const useCharacterStoreContext = (): Store<PlayerCharacterData> => {
	const store = useContext(CharacterStoreContext);

	if (!store) {
		throw new Error(
			"useActiveCharacterStore must be used within a CharacterStoreProvider",
		);
	}

	return store;
};

export function useCharacterStore<TData>(
	selector: CharacterDataSelector<TData>,
): TData {
	const store = useCharacterStoreContext();
	return useStore(store, selector);
}
