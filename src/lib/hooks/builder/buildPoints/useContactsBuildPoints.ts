import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getContactBpCost } from "#/components/builder/sections/contacts/contactsBuilderUtils.ts"
import { ContactsSelectors } from "#/lib/stores/runner/contacts/contactsSlice.selectors.ts"
import { useRunnerSelector } from "#/lib/stores/runner/runnerStore.selectors.ts"

export const useContactsBuildPoints = () => {
  const contacts = useRunnerSelector(ContactsSelectors.selectAll)
  return {
    sectionId: BuilderSectionId.contacts,
    label: "Contacts",
    spent: contacts
      .map((contact) => getContactBpCost(contact))
      .reduce((total, cost) => total + cost, 0),
  }
}
