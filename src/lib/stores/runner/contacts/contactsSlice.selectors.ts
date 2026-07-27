import type { ContactData } from "#/system/contactData.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export function selectContacts(state: RunnerData): ContactData[] {
  return state.contacts
}
