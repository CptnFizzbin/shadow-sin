import { useMatches, useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"

import type { RunnerSection } from "#/components/runner/runnerSections.ts"
import { runnerSections } from "#/components/runner/runnerSections.ts"
import { NumberUtils } from "#/lib/numberUtils.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"

import { selectRunnerTabs } from "./useRunnerTabs.ts"

export const useCurrentRunnerSection = (): RunnerSection => {
  const matches = useMatches()
  const routeIds = matches.map((match) => match.routeId)

  return Object.values(runnerSections).find(({ route }) => {
    return routeIds.includes(route.id)
  }) || runnerSections.about
}

export function useRunnerNav() {
  const navigate = useNavigate({ from: "/$runnerId" })
  const currentSection = useCurrentRunnerSection()
  const visibleSections = useRunnerSelector(selectRunnerTabs)

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
