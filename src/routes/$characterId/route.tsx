import Stack from "@mui/material/Stack"
import { useThrottler } from "@tanstack/react-pacer"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useEffect, useMemo, useRef } from "react"

import { CharacterSheetProvider, useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/Character/CharacterSheetStore.ts"
import { Header } from "#/components/UI/Header.tsx"
import { Artemis } from "#/lib/fixture/character/artemis.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/LocalCharacterManager.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"

export const Route = createFileRoute("/$characterId")({
  component: CharacterRoute,
  loader: async ({ params }): Promise<CharacterSheet> => {
    await localCharacterManager.ensureCharacters([Artemis])
    const character = await localCharacterManager.getCharacter(params.characterId)

    if (!character) {
      throw new Error(`Character "${params.characterId}" was not found.`)
    }

    return character
  },
})

const CharacterStorePersistence: FC = () => {
  const characterStore = useCharacterSheetContext()
  const character = useStore(characterStore, (state) => state)
  const hasMountedRef = useRef(false)
  const characterSaveThrottler = useThrottler(
    (nextCharacter: CharacterSheet) => {
      void localCharacterManager.saveCharacter(nextCharacter)
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
  const store = useMemo(() => new CharacterSheetStore(character), [character])

  return (
    <CharacterSheetProvider store={store}>
      <CharacterStorePersistence />

      <Stack spacing={2}>
        <Header character={character} />

        <Outlet />
      </Stack>
    </CharacterSheetProvider>
  )
}
