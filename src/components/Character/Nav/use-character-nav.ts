import { useMatches, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"

import type { CharacterSection } from "#/components/Character/character-sections.ts"
import { characterSectionOrder, characterSections } from "#/components/Character/character-sections.ts"

export const useCurrentCharacterSection = (): CharacterSection => {
  const matches = useMatches()
  const routeIds = matches.map((match) => match.routeId)

  return Object.values(characterSections).find(({ route }) => {
    return routeIds.includes(route.id)
  }) || characterSections.about
}

export function useCharacterNav() {
  const navigate = useNavigate({ from: "/$characterId" })
  const currentSection = useCurrentCharacterSection()
  const currentIndex = characterSectionOrder.indexOf(currentSection)

  const nextPage = useCallback(() => {
    if (currentIndex !== -1 && currentIndex < characterSectionOrder.length - 1) {
      navigate({ to: characterSectionOrder[currentIndex + 1].route.path })
    }
  }, [currentIndex, navigate])

  const prevPage = useCallback(() => {
    if (currentIndex !== -1 && currentIndex > 0) {
      navigate({ to: characterSectionOrder[currentIndex - 1].route.path })
    }
  }, [currentIndex, navigate])

  return { nextPage, prevPage }
}
