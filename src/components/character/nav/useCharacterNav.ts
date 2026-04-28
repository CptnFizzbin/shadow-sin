import { useMatches, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"

import type { CharacterSection } from "#/components/character/characterSections.ts"
import { characterSections } from "#/components/character/characterSections.ts"
import { NumberUtils } from "#/lib/numberUtils.ts"

import { useCharacterSheetTabs } from "./useCharacterSheetTabs.ts"

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
  const visibleSections = useCharacterSheetTabs()

  const currentIndex = visibleSections.indexOf(currentSection)

  const nextPage = useCallback(() => {
    const nextIndex = NumberUtils.clamp(currentIndex + 1, { max: visibleSections.length - 1 })
    navigate({ to: visibleSections[nextIndex].route.path })
  }, [currentIndex, navigate, visibleSections])

  const prevPage = useCallback(() => {
    const prevIndex = NumberUtils.clamp(currentIndex - 1, { min: 0 })
    navigate({ to: visibleSections[prevIndex].route.path })
  }, [currentIndex, navigate, visibleSections])

  return { nextPage, prevPage }
}
