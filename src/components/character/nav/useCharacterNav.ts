import { useMatches, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"

import type { CharacterSection } from "#/components/character/characterSections.ts"
import { characterSectionOrder, characterSections } from "#/components/character/characterSections.ts"
import { useCharacterSheet } from "#/components/character/sheet/characterSheetProvider.tsx"

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
  const awakening = useCharacterSheet((sheet) => sheet.biology.awakening)

  const visibleSections = characterSectionOrder.filter(
    (section) => !section.visibleFor || section.visibleFor.includes(awakening),
  )

  const currentIndex = visibleSections.indexOf(currentSection)

  const nextPage = useCallback(() => {
    if (currentIndex !== -1 && currentIndex < visibleSections.length - 1) {
      navigate({ to: visibleSections[currentIndex + 1].route.path })
    }
  }, [currentIndex, navigate, visibleSections])

  const prevPage = useCallback(() => {
    if (currentIndex !== -1 && currentIndex > 0) {
      navigate({ to: visibleSections[currentIndex - 1].route.path })
    }
  }, [currentIndex, navigate, visibleSections])

  return { nextPage, prevPage }
}
