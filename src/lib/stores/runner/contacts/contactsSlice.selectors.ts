import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import type { ContactData } from "#/system/contactData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

/** `TState` for the namespace below — file-local, same pattern as `AttrState` in
 *  `attributesSlice.selectors.ts`, not a shared cross-file helper. */
interface RunnerState {
  runner: RunnerData
}

export function selectContacts(state: RunnerData): ContactData[] {
  return state.contacts
}

const legacy = { selectContacts }

/** Standardized, namespaced selectors for the Contacts domain — see
 *  docs/adr/0014-selector-input-decomposition.md. Wraps the legacy exports above; existing call
 *  sites are unaffected. */
export namespace ContactsSelectors {
  export const selectAll: Selector<RunnerState, ContactData[]> = (state) => legacy.selectContacts(state.runner)
}
