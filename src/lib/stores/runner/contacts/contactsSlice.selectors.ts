import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { mapToLegacySelector } from "#/lib/stores/runner/mapToLegacySelector.ts"
import { ViewerStateSelectors } from "#/lib/stores/runner/viewerSelector.ts"
import type { ContactData } from "#/system/contactData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** @deprecated Use `ContactsSelectors.selectAll` via `useRunnerSelector` instead. */
export function selectContacts(runner: RunnerData): ContactData[] {
  return mapToLegacySelector(runner, ContactsSelectors.selectAll)
}

/** Standardized, namespaced selectors for the Contacts domain — see
 *  docs/adr/0014-selector-input-decomposition.md. */
export namespace ContactsSelectors {
  export type ContactsSelector<TReturn, TOptions extends object | never = never> = Selector<
    { runner: RunnerData }, TReturn, TOptions
  >

  export const selectAll = createMemoizedSelector(
    ViewerStateSelectors.selectRunner,
    (runner) => runner.contacts,
  ) satisfies ContactsSelector<ContactData[]>
}
