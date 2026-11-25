import { getContactBpCost } from "#/rules/buildPoints/contactsBuilderUtils.ts"
import { BuilderSectionId } from "#/state/builder/builderSectionId.ts"
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
