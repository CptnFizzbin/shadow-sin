import { produce } from "immer"
import { useMemo } from "react"

import { useRunnerDataContext } from "#/components/runner/sheet/runnerDataProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { ContactsStore } from "./contactsStore.ts"

/** @deprecated Use `useRunnerStoreSelector(selectContacts)` from `#/stores/runner/contacts/contactsSlice.selectors.ts` + `useRunnerStoreDispatch()` instead. */
export function useContactsStore() {
  const store = useRunnerDataContext()

  return useMemo((): ContactsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.contacts,
      (root, contacts) => produce(root, (draft) => { draft.contacts = contacts }),
    )

    return new ContactsStore(atom)
  }, [store])
}
