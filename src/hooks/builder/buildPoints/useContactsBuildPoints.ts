import { BuilderSectionId } from "#/components/builder/builderSectionId.ts"
import { getContactBpCost } from "#/components/contacts/builder/contactsBuilderUtils.ts"
import { ContactsSelectors } from "#/state/runner/contacts/contacts.selector.ts"
import { useRunnerSelector } from "#/state/runner/runnerStore.selectors.ts"

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
