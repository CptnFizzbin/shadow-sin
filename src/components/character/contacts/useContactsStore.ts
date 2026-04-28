import { produce } from "immer"
import { useMemo } from "react"

import { useCharacterSheetContext } from "#/components/character/sheet/characterSheetProvider.tsx"
import { createSliceAtom } from "#/integrations/tanstackStore/atomUtils.ts"

import { ContactsStore } from "./contactsStore.ts"

export function useContactsStore() {
  const store = useCharacterSheetContext()

  return useMemo((): ContactsStore => {
    const atom = createSliceAtom(
      store,
      (root) => root.contacts,
      (root, contacts) => produce(root, (draft) => { draft.contacts = contacts }),
    )

    return new ContactsStore(atom)
  }, [store])
}
