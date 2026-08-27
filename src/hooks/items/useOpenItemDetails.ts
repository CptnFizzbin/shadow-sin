import { useNavigate } from "@tanstack/react-router"

import { useIsBuilder } from "#/contexts/builder/builderStore.context.ts"
import type { UUID } from "#/lib/uuidUtils.ts"
import { useRunnerSelector } from "#/stores/runner/runnerStore.selectors.ts"
import { ViewerStateSelectors } from "#/stores/runner/viewerSelector.ts"

/**
 * Returns a callback that navigates to an item's details page, or
 * `undefined` when rendered inside the Builder — which has no details page
 * of its own and keeps its existing tap-to-edit behavior instead.
 *
 * For components used only in the Viewer, wiring `onOpen` to
 * `useNavigate({ from: "/$runnerId" })` directly is simpler and preferred.
 * This hook exists for the few list components shared between Builder and
 * Viewer (e.g. `ImplantItemList`), which can't assume which context they're
 * rendered in and so can't hardcode a `from`.
 */
// Reads `runnerId` off the RunnerStore rather than route params — `useParams` requires a Router
// context, which Builder-context tests don't provide, and `useGearByType` and friends already
// prove the store is reachable in both contexts.
export function useOpenItemDetails(): ((itemId: UUID) => void) | undefined {
  const isBuilder = useIsBuilder()
  const runnerId = useRunnerSelector(ViewerStateSelectors.selectRunner).id
  const navigate = useNavigate()

  if (isBuilder) return undefined

  return (itemId) => navigate({ to: "/$runnerId/item/$itemId", params: { runnerId, itemId } })
}
