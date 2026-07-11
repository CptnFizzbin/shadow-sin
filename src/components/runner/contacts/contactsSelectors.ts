import type { ContactData } from "#/system/contactData.ts"

/** @deprecated Use `selectContacts` from `#/stores/runner/contacts/contactsSlice.selectors.ts` via `useRunnerStoreSelector` instead. Operates on the already-sliced `ContactData[]`, not `RunnerData`, so it can't delegate to the new selector directly. */
export const selectAllContacts = (state: ContactData[]) => state
