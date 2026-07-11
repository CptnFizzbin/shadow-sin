import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getContactBpCost } from "#/components/builder/sections/contacts/contactsBuilderUtils.ts"
import { useRunnerData } from "#/components/runner/sheet/runnerDataProvider.tsx"

export const useContactsBuildPoints = () => {
  const contacts = useRunnerData((state) => state.contacts)
  return {
    sectionId: BuilderSectionId.contacts,
    label: "Contacts",
    spent: contacts
      .map((contact) => getContactBpCost(contact))
      .reduce((total, cost) => total + cost, 0),
  }
}
