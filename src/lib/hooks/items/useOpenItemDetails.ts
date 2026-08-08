import { useNavigate } from "@tanstack/react-router"

import { useIsBuilder } from "#/lib/contexts/builder/builderStore.context.ts"
import { useRunnerStoreSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"
import type { UUID } from "#/lib/uuidUtils.ts"

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
export function useOpenItemDetails(): ((itemId: UUID) => void) | undefined {
  const isBuilder = useIsBuilder()
  const runnerId = useRunnerStoreSelector((state) => state.id)
  const navigate = useNavigate()

  if (isBuilder) return undefined

  return (itemId) => navigate({ to: "/$runnerId/item/$itemId", params: { runnerId, itemId } })
}
