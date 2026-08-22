import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { ContactData } from "#/system/contactData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `ContactsSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectContacts(runner: RunnerData): ContactData[] {
  return mapToLegacySelector(runner, ContactsSelectors.selectAll)
}

export namespace ContactsSelectors {
  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.contacts,
  )
}
