import Stack from "@mui/material/Stack"
import { useThrottler } from "@tanstack/react-pacer"
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router"
import { useStore } from "@tanstack/react-store"
import type { FC } from "react"
import { useCallback, useEffect, useMemo, useRef } from "react"

import { CharacterSheetProvider, useCharacterSheetContext } from "#/components/Character/CharacterSheetProvider.tsx"
import { CharacterSheetStore } from "#/components/Character/CharacterSheetStore.ts"
import { characterSections } from "#/components/Character/characterSections.ts"
import { Header } from "#/components/UI/Header.tsx"
import { SwipeSurface } from "#/components/UI/SwipeSurface.tsx"
import { Artemis } from "#/lib/fixture/character/artemis.ts"
import { localCharacterManager } from "#/lib/storage/local-storage/LocalCharacterManager.ts"
import type { CharacterSheet } from "#/lib/system/characterSheet.ts"
import { Route as CharacterIndexRoute } from "#/routes/$characterId/index.tsx"

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

const sectionRoutes = characterSections.map((section) => section.to)

function useSwipeNavigation() {
  const navigate = useNavigate({ from: CharacterIndexRoute.fullPath })
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  const pathSegments = pathname.split("/").filter(Boolean)
  const currentSection = pathSegments[pathSegments.length - 1] ?? "about"
  const currentIndex = sectionRoutes.indexOf(currentSection)

  const handleSwipeLeft = useCallback(() => {
    if (currentIndex !== -1 && currentIndex < sectionRoutes.length - 1) {
      void navigate({ to: sectionRoutes[currentIndex + 1] })
    }
  }, [currentIndex, navigate])

  const handleSwipeRight = useCallback(() => {
    if (currentIndex !== -1 && currentIndex > 0) {
      void navigate({ to: sectionRoutes[currentIndex - 1] })
    }
  }, [currentIndex, navigate])

  return { handleSwipeLeft, handleSwipeRight }
}

function CharacterRoute() {
  const character = Route.useLoaderData()
  const store = useMemo(() => new CharacterSheetStore(character), [character])
  const { handleSwipeLeft, handleSwipeRight } = useSwipeNavigation()

  return (
    <CharacterSheetProvider store={store}>
      <CharacterStorePersistence />

      <Stack spacing={2}>
        <Header character={character} />

        <SwipeSurface onSwipeLeft={handleSwipeLeft} onSwipeRight={handleSwipeRight}>
          <Outlet />
        </SwipeSurface>
      </Stack>
    </CharacterSheetProvider>
  )
}
