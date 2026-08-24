import type { BpLineItem } from "#/components/builder/buildPoints/bpLineItem.ts"
import { BuilderSectionId } from "#/components/builder/sections/builderSectionId.ts"
import { getContactBpCost } from "#/components/builder/sections/contacts/contactsBuilderUtils.ts"
import type { Selector } from "#/integrations/reselect/selectorUtils.ts"
import { createMemoizedSelector } from "#/integrations/reselect/selectorUtils.ts"
import { ContactsSelectors } from "#/stores/runner/contacts/contactsSlice.selectors.ts"
import type { RunnerData } from "#/system/runnerData.ts"

export const selectContactsBuildPoints: Selector<{ runner: RunnerData }, BpLineItem & { label: string }> = createMemoizedSelector(
  ContactsSelectors.selectAll,
  (contacts) => ({
    sectionId: BuilderSectionId.contacts,
    label: "Contacts",
    spent: contacts
      .map((contact) => getContactBpCost(contact))
      .reduce((total, cost) => total + cost, 0),
  }),
)
