import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getContactBpCost } from "#/components/builder/sections/contacts/contactsBuilderUtils.ts"
import { Selectors, useRunnerStoreSelector } from "#/stores/runner/runnerStore.selectors.ts"

export const useContactsBuildPoints = () => {
  const contacts = useRunnerStoreSelector(Selectors.contacts.selectContacts)
  return {
    sectionId: BuilderSectionId.contacts,
    label: "Contacts",
    spent: contacts
      .map((contact) => getContactBpCost(contact))
      .reduce((total, cost) => total + cost, 0),
  }
}
