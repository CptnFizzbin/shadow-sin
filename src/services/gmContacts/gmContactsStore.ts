import { z } from "zod"

import { createCompatStore } from "#/integrations/reduxToolkit/compatStore.ts"
import { useSelector } from "#/integrations/reduxToolkit/useSelector.ts"
import { contactsReducer } from "#/state/runner/contacts/contacts.state.ts"
import type { ContactData } from "#/system/model/contacts/contactData.ts"
import { ContactDataSchema } from "#/system/model/contacts/contactData.ts"

const storageKey = "shadowsin:gm/contacts"

/** Reads the GM's saved contacts, falling back to none when nothing valid is stored. */
export function loadGmContacts(storage: Storage | undefined = globalThis.localStorage): ContactData[] {
  const raw = storage?.getItem(storageKey)
  if (!raw) return []

  try {
    const parsed = z.array(ContactDataSchema).safeParse(JSON.parse(raw))
    return parsed.success ? parsed.data : []
  } catch {
    return []
  }
}

/** Saves the GM's contacts so they survive a page reload. */
export function saveGmContacts(contacts: ContactData[], storage: Storage | undefined = globalThis.localStorage): void {
  storage?.setItem(storageKey, JSON.stringify(contacts))
}

/**
 * A single, app-wide instance — the GM keeps one contacts list for every game they run, so unlike
 * the per-runner store this needs no context/provider to pick an instance.
 */
const gmContactsStore = createCompatStore(loadGmContacts(), contactsReducer)

gmContactsStore.subscribe((contacts) => saveGmContacts(contacts))

type GmContactsDispatch = typeof gmContactsStore.dispatch

export function useGmContactsDispatch(): GmContactsDispatch {
  return gmContactsStore.dispatch
}

export function useGmContacts(): ContactData[] {
  return useSelector(gmContactsStore, (contacts) => contacts)
}
