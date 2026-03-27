import Stack from "@mui/material/Stack"
import { useThrottler } from "@tanstack/react-pacer"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import { createStore } from "@tanstack/store"
import type { FC } from "react"
import { useEffect, useMemo, useRef } from "react"

import { CharacterStoreProvider, useCharacterStoreContext } from "#/components/Character/CharacterStoreProvider.tsx"
import { Header } from "#/components/UI/Header.tsx"
import { characterManager } from "#/lib/storage/index.ts"
import type { PlayerCharacterData } from "#/lib/system/playerCharacterData.ts"

export const Route = createFileRoute("/$characterId")({
  component: CharacterRoute,
  loader: async ({ params }): Promise<PlayerCharacterData> => {
    await characterManager.ensureCharacters([])
    const character = await characterManager.getCharacter(params.characterId)

    if (!character) {
      throw new Error(`Character "${params.characterId}" was not found.`)
    }

    return character
  },
})

const CharacterStorePersistence: FC = () => {
  const characterStore = useCharacterStoreContext()
  const character = useStore(characterStore, (state) => state)
  const hasMountedRef = useRef(false)
  const characterSaveThrottler = useThrottler(
    (nextCharacter: PlayerCharacterData) => {
      void characterManager.saveCharacter(nextCharacter)
    },
    {
      wait: 30_000,
      leading: false,
      trailing: true,
      onUnmount: (throttler) => {
        throttler.flush()
      },
    },
  )

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }

    characterSaveThrottler.maybeExecute(character)
  }, [character, characterSaveThrottler])

  return null
}

function CharacterRoute() {
  const character = Route.useLoaderData()
  const store = useMemo(() => createStore(character), [character])

  return (
    <CharacterStoreProvider store={store}>
      <CharacterStorePersistence />

      <Stack spacing={2}>
        <Header character={character} />

        <Outlet />
      </Stack>
    </CharacterStoreProvider>
  )
}
